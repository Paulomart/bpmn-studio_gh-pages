// tslint:disable:typedef
const params = {
  formKey: ':form_key',
};

const paths = {
  getIndex: `/${params.formKey}`,
  getWebcomponent: `/webcomponent/${params.formKey}`,
};

/**
 * Contains the endpoints and various rest parameters used by the external task api.
 */
export const restSettings = {
  /**
   * A collection of all url parameters employed by the external task api.
   */
  params: params,
  /**
   * A collection of all urls employed by the external task api.
   */
  paths: paths,
};
