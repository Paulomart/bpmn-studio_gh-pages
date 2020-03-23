import {restSettings} from '@process-engine/management_api_contracts';
import * as Swagger from 'openapi-doc';
import * as fs from 'fs';
import * as typescript from 'typescript';

const swagger = new Swagger();
swagger.info('ManagementApi', '1.0', 'This is the swagger ui documentation of the ManagementApi.');

const baseRoute = '/api/management/v1';

type SwaggerParameter = {
  in: string;
  name: string;
  type: string;
  description: string;
};
type SwaggerParameterList = {[name: string]: SwaggerParameter};

type SwaggerRoute = {
  summary: string;
  method: string;
  tag: string;
};
type SwaggerRouteList = {[name: string]: SwaggerRoute};

const swaggerPathParameters: SwaggerParameterList = {};
const swaggerRouteData: SwaggerRouteList = {};

function createSwaggerPathParameter(sourceFile: typescript.SourceFile, properties: Array<any>): void {
  for (const property of properties) {
    const propertyTextWithComment = property.getFullText(sourceFile);
    const propertyTextWithoutComment = property.getText(sourceFile);

    const propertyValue = property.initializer.getText(sourceFile);
    const propertyDocumentation = propertyTextWithComment.replace(propertyTextWithoutComment, '');

    const swaggerParameterName = convertPropertyValueToSwaggerParameterName(propertyValue);
    const swaggerDescription = convertPropertyDocumentationToSwaggerDescription(propertyDocumentation);

    addSwaggerPathParameter(swaggerParameterName, swaggerDescription);
  }
}

function convertPropertyValueToSwaggerParameterName(propertyValue: string): string {
  return propertyValue
    .replace(/[':]/g, '');
}

function convertPropertyDocumentationToSwaggerDescription(propertyDocumentation: string): string {
  return propertyDocumentation
    .replace(/\/\//g, '')
    .replace(/[/*]/g, '')
    .trim();
}

function convertPropertyDocumentationToSwaggerRoute(propertyDocumentation: string): SwaggerRoute {
  const isSingleLineComment = !propertyDocumentation.trim().endsWith('*/');
  if (isSingleLineComment) {
    throw new Error('Route paths must be documented with a summary (without prefix), a tag (@tag) and a method (@method).');
  }

  const propertyDocumentationWithoutCommentMarks = propertyDocumentation
    .replace(/[/*]/g, '')
    .trim();

  const propertyDocumentationLines = propertyDocumentationWithoutCommentMarks
    .split('\n')
    .map((documentationLine): string => documentationLine.trim());

  const swaggerRoute: SwaggerRoute = {
    summary: '',
    tag: '',
    method: '',
  };

  propertyDocumentationLines.forEach((documentationLine): void => {
    if (documentationLine.startsWith('@')) {
      const propertyName = documentationLine.replace('@', '').split(' ')[0];

      swaggerRoute[propertyName] = documentationLine.replace(`@${propertyName}`, '').trim();
      return;
    }

    if (swaggerRoute.summary === '') {
      swaggerRoute.summary = documentationLine;
    } else {
      swaggerRoute.summary += ` ${documentationLine}`;
    }
  });

  if (swaggerRoute.tag === '' || swaggerRoute.method === '') {
    throw new Error('Route paths must be documented with a summary (without prefix), a tag (@tag) and a method (@method).');
  }

  return swaggerRoute;
}

function addSwaggerPathParameter(parameterName: string, swaggerDescription: string): void {
  const parameter: SwaggerParameter = {
    in: 'path',
    name: parameterName,
    type: 'string',
    description: swaggerDescription,
  };

  swaggerPathParameters[parameterName] = parameter;
}

function addSwaggerRoute(routeName: string, route: SwaggerRoute): void {
  swaggerRouteData[routeName] = route;
}

function getSwaggerRouteDataByRouteName(routeName: string): SwaggerRoute {
  return swaggerRouteData[routeName];
}

function getSwaggerParameterByPropertyName(propertyName: string): SwaggerParameter {
  return swaggerPathParameters[propertyName];
}

function generateSwaggerJson(): void {
  extractSwaggerDataFromContracts();

  swagger.securityDefinition('bearer', {
    type: 'apiKey',
    description: 'An Identity Token is required to make requests to the ManagementApi.\nDummy token: \'Bearer ZHVtbXlfdG9rZW4=\'',
    in: 'header',
    name: 'Authorization',
  });
  swagger.globalSecurity('bearer');

  const routeNames: Array<string> = Object.keys(restSettings.paths);
  for (const routeName of routeNames) {

    const path = restSettings.paths[routeName];
    const routeData = getSwaggerRouteDataByRouteName(routeName);

    const route = `${baseRoute}${path}`;
    const parameters: Array<SwaggerParameter> = getSwaggerParametersForRoute(route);
    const id = routeName;
    const tag = routeData.tag;
    const summary = routeData.summary;
    const method = routeData.method;

    let newRoute;
    if (method.toLowerCase() === 'get') {
      newRoute = swagger.get(route);
    } else if (method.toLowerCase() === 'post') {
      newRoute = swagger.post(route);
    } else if (method.toLowerCase() === 'put') {
      newRoute = swagger.put(route);
    } else if (method.toLowerCase() === 'patch') {
      newRoute = swagger.patch(route);
    } else if (method.toLowerCase() === 'head') {
      newRoute = swagger.head(route);
    } else if (method.toLowerCase() === 'options') {
      newRoute = swagger.options(route);
    } else if (method.toLowerCase() === 'delete') {
      newRoute = swagger.delete(route);
    }

    newRoute.parameters(parameters)
      .operationId(id)
      .tag(tag)
      .summary(summary)
      .response(200);
  }

  fs.writeFileSync('swagger.json', JSON.stringify(swagger.doc));
}

function getSwaggerParametersForRoute(route): Array<SwaggerParameter> {
  const swaggerParameters: Array<SwaggerParameter> = [];

  const parametersInRoute = extractParametersFromRoute(route);

  for (const parameter of parametersInRoute) {
    swaggerParameters.push(getSwaggerParameterByPropertyName(parameter));
  }

  return swaggerParameters;
}

function extractParametersFromRoute(route: string): Array<string> {
  const parameters = route.split('/')
    .filter((routePart: string): boolean => {
      return routePart.startsWith(':');
    })
    .map((parameter: string): string => {
      return parameter.replace(':', '');
    });

  return parameters;
}

function createSwaggerRoutes(sourceFile: typescript.SourceFile, properties: Array<any>): void {
  for (const property of properties) {
    const propertyTextWithComment = property.getFullText(sourceFile);
    const propertyTextWithoutComment = property.getText(sourceFile);
    const propertyDocumentation = propertyTextWithComment.replace(propertyTextWithoutComment, '');

    const routeName = property.name.getText(sourceFile);
    const swaggerRoute = convertPropertyDocumentationToSwaggerRoute(propertyDocumentation);

    addSwaggerRoute(routeName, swaggerRoute);
  }
}

function extractSwaggerDataFromContracts(): void {
  const restSettingsFileName = 'node_modules/@process-engine/management_api_contracts/src/rest_settings.ts';

  const program = typescript.createProgram([restSettingsFileName], {});
  const sourceFile = program.getSourceFile(restSettingsFileName);

  for (const statement of sourceFile.statements) {
    statement.forEachChild((statementNode: any): void => {
      if (
        statementNode.declarations === undefined ||
        statementNode.declarations.length < 1 ||
        !typescript.isVariableDeclaration(statementNode.declarations[0])) {

        return;
      }

      const variable = statementNode.declarations[0] as any;
      const variableName = variable.name.getText(sourceFile);
      const properties = variable.initializer.properties;

      if (variableName === 'params') {
        createSwaggerPathParameter(sourceFile, properties);
      } else if (variableName === 'paths') {
        createSwaggerRoutes(sourceFile, properties);
      }
    });
  }
}

generateSwaggerJson();
