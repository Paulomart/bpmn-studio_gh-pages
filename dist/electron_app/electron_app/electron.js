"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var os_1 = require("os");
var child_process_1 = require("child_process");
var electron_window_state_1 = __importDefault(require("electron-window-state"));
var jszip_1 = __importDefault(require("jszip"));
var electron_1 = require("electron");
var about_window_1 = __importDefault(require("about-window"));
var get_port_1 = __importDefault(require("get-port"));
var open_1 = __importDefault(require("open"));
var electron_updater_1 = require("@process-engine/electron-updater");
var package_json_1 = require("@process-engine/process_engine_runtime/package.json");
var release_channel_service_1 = __importDefault(require("../src/services/release-channel-service/release-channel.service"));
var solution_is_remote_solution_module_1 = require("../src/services/solution-is-remote-solution-module/solution-is-remote-solution.module");
var package_json_2 = require("../package.json");
var default_ports_module_1 = require("../src/services/default-ports-module/default-ports.module");
var electron = require("electron");
var ipcMain = electron.ipcMain;
var dialog = electron.dialog;
var app = electron.app;
var browserWindow;
var releaseChannel = new release_channel_service_1.default(package_json_2.version);
var fileAssociationFilePath;
var isInitialized = false;
var peErrors = '';
var fileOpenMainEvent;
var runtimeProcess;
process.on('exit', function () {
    if (runtimeProcess) {
        runtimeProcess.kill('SIGTERM');
    }
});
function execute() {
    app.requestSingleInstanceLock();
    var hasSingleInstanceLock = app.hasSingleInstanceLock();
    if (hasSingleInstanceLock) {
        initializeApplication();
        startInternalProcessEngine();
        app.on('second-instance', function (event, argv, workingDirectory) {
            var noArgumentsSet = argv[1] === undefined;
            if (noArgumentsSet) {
                return;
            }
            var argumentIsFilePath = argv[1].endsWith('.bpmn');
            var argumentIsSignInRedirect = argv[1].startsWith('bpmn-studio://signin-oidc');
            var argumentIsSignOutRedirect = argv[1].startsWith('bpmn-studio://signout-oidc');
            if (argumentIsFilePath) {
                var filePath = argv[1];
                bringExistingInstanceToForeground();
                answerOpenFileEvent(filePath);
            }
            var argumentContainsRedirect = argumentIsSignInRedirect || argumentIsSignOutRedirect;
            if (argumentContainsRedirect) {
                var redirectUrl_1 = argv[1];
                browserWindow.loadURL("file://" + __dirname + "/../../../index.html");
                browserWindow.loadURL('/');
                ipcMain.once('deep-linking-ready', function () {
                    browserWindow.webContents.send('deep-linking-request', redirectUrl_1);
                });
            }
        });
    }
    else {
        app.quit();
    }
}
function initializeApplication() {
    var _this = this;
    app.on('ready', function () {
        createMainWindow();
    });
    app.on('activate', function () {
        if (browserWindow === undefined) {
            createMainWindow();
        }
    });
    ipcMain.on('restart', function () {
        app.relaunch();
        app.quit();
    });
    ipcMain.on('isDevelop', function (event) {
        event.sender.send('isDevelop', releaseChannel.isDev());
    });
    ipcMain.on('create-feedback-zip', function (event, feedbackData) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            createFeedbackZip(feedbackData);
            return [2];
        });
    }); });
    var portableIdentifier = electron.app.getName().includes('-portable');
    if (!releaseChannel.isDev() && !process.env.SPECTRON_TESTS && !portableIdentifier) {
        initializeAutoUpdater();
    }
    initializeFileOpenFeature();
}
function initializeAutoUpdater() {
    var _this = this;
    ipcMain.on('app_ready', function (appReadyEvent) { return __awaiter(_this, void 0, void 0, function () {
        var currentVersion, currentReleaseChannel, currentVersionIsPrerelease, updateCheckResult, noUpdateAvailable, newReleaseChannel, downloadCancellationToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    electron_updater_1.autoUpdater.autoDownload = false;
                    currentVersion = app.getVersion();
                    currentReleaseChannel = new release_channel_service_1.default(currentVersion);
                    currentVersionIsPrerelease = currentReleaseChannel.isAlpha() || currentReleaseChannel.isBeta();
                    electron_updater_1.autoUpdater.allowPrerelease = currentVersionIsPrerelease;
                    electron_updater_1.autoUpdater.channel = currentReleaseChannel.getName();
                    return [4, electron_updater_1.autoUpdater.checkForUpdates()];
                case 1:
                    updateCheckResult = _a.sent();
                    noUpdateAvailable = updateCheckResult.updateInfo.version === currentVersion;
                    if (noUpdateAvailable) {
                        return [2];
                    }
                    newReleaseChannel = new release_channel_service_1.default(updateCheckResult.updateInfo.version);
                    if (currentVersionIsPrerelease) {
                        if (currentReleaseChannel.isAlpha() && !newReleaseChannel.isAlpha()) {
                            return [2];
                        }
                        if (currentReleaseChannel.isBeta() && !newReleaseChannel.isBeta()) {
                            return [2];
                        }
                    }
                    console.log("CurrentVersion: " + currentVersion + ", CurrentVersionIsPrerelease: " + currentVersionIsPrerelease);
                    electron_updater_1.autoUpdater.addListener('error', function (error) {
                        appReadyEvent.sender.send('update_error', error.message);
                    });
                    electron_updater_1.autoUpdater.addListener('download-progress', function (progressObj) {
                        var progressInPercent = progressObj.percent / 100;
                        browserWindow.setProgressBar(progressInPercent);
                        appReadyEvent.sender.send('update_download_progress', progressObj);
                    });
                    electron_updater_1.autoUpdater.addListener('update-available', function (updateInfo) {
                        appReadyEvent.sender.send('update_available', updateInfo.version);
                        ipcMain.on('download_update', function () {
                            downloadCancellationToken = new electron_updater_1.CancellationToken();
                            electron_updater_1.autoUpdater.downloadUpdate(downloadCancellationToken);
                            ipcMain.on('cancel_update', function () {
                                downloadCancellationToken.cancel();
                            });
                        });
                        ipcMain.on('show_release_notes', function () {
                            var releaseNotesWindow = new electron_1.BrowserWindow({
                                width: 600,
                                height: 600,
                                title: "Release Notes " + updateInfo.version,
                                minWidth: 600,
                                minHeight: 600,
                            });
                            releaseNotesWindow.loadURL("https://github.com/process-engine/bpmn-studio/releases/tag/v" + updateInfo.version);
                        });
                    });
                    electron_updater_1.autoUpdater.addListener('update-downloaded', function () {
                        appReadyEvent.sender.send('update_downloaded');
                        ipcMain.on('quit_and_install', function () {
                            electron_updater_1.autoUpdater.quitAndInstall();
                        });
                    });
                    electron_updater_1.autoUpdater.checkForUpdates();
                    return [2];
            }
        });
    }); });
}
function initializeFileOpenFeature() {
    app.on('window-all-closed', function () {
        app.quit();
        fileAssociationFilePath = undefined;
    });
    app.on('will-finish-launching', function () {
        if (process.platform === 'win32' && process.argv.length >= 2 && process.argv[1].endsWith('.bpmn')) {
            fileAssociationFilePath = process.argv[1];
        }
        app.on('open-file', function (event, filePath) {
            fileAssociationFilePath = isInitialized ? undefined : filePath;
            if (isInitialized) {
                answerOpenFileEvent(filePath);
            }
        });
    });
    ipcMain.on('waiting-for-double-file-click', function (mainEvent) {
        fileOpenMainEvent = mainEvent;
        isInitialized = true;
    });
    ipcMain.on('get_opened_file', function (event) {
        var filePathExists = fileAssociationFilePath === undefined;
        if (filePathExists) {
            event.returnValue = {};
            return;
        }
        event.returnValue = {
            path: fileAssociationFilePath,
            content: fs_1.default.readFileSync(fileAssociationFilePath, 'utf8'),
        };
        fileAssociationFilePath = undefined;
        app.focus();
    });
}
function answerOpenFileEvent(filePath) {
    fileOpenMainEvent.sender.send('double-click-on-file', filePath);
}
function getProductName() {
    switch (releaseChannel.getName()) {
        case 'stable':
            return 'BPMN Studio';
        case 'beta':
            return 'BPMN Studio (Beta)';
        case 'alpha':
            return 'BPMN Studio (Alpha)';
        case 'dev':
            return 'BPMN Studio (Dev)';
        default:
            return 'BPMN Studio (pre)';
    }
}
function createMainWindow() {
    console.log('create window called');
    setElectronMenubar();
    var mainWindowState = electron_window_state_1.default({
        defaultWidth: 1300,
        defaultHeight: 800,
    });
    browserWindow = new electron_1.BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        title: getProductName(),
        minWidth: 1300,
        minHeight: 800,
        show: false,
        backgroundColor: '#f7f7f7',
        icon: path_1.default.join(__dirname, '../build/icon.png'),
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindowState.manage(browserWindow);
    browserWindow.on('ready-to-show', function () {
        browserWindow.show();
    });
    browserWindow.loadURL("file://" + __dirname + "/../../../index.html");
    browserWindow.loadURL('/');
    ipcMain.on('close_bpmn-studio', function (event) {
        var focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
        focusedWindow.close();
    });
    browserWindow.on('closed', function (event) {
        browserWindow = null;
    });
    browserWindow.on('enter-full-screen', function () {
        browserWindow.webContents.send('toggle-fullscreen', true);
    });
    browserWindow.on('leave-full-screen', function () {
        browserWindow.webContents.send('toggle-fullscreen', false);
    });
    browserWindow.webContents.on('new-window', function (event, url) {
        if (url !== browserWindow.webContents.getURL()) {
            event.preventDefault();
            open_1.default(url);
        }
    });
    setOpenDiagramListener();
    setOpenSolutionsListener();
    setSaveDiagramAsListener();
    var platformIsWindows = process.platform === 'win32';
    if (platformIsWindows) {
        browserWindow.webContents.session.on('will-download', function (event, downloadItem) {
            var defaultFilename = downloadItem.getFilename();
            var fileExtension = path_1.default.extname(defaultFilename);
            var fileExtensionIsBPMN = fileExtension === 'bpmn';
            var fileType = fileExtensionIsBPMN ? 'BPMN (.bpmn)' : "Image (" + fileExtension + ")";
            downloadItem.setSaveDialogOptions({
                defaultPath: defaultFilename,
                filters: [
                    {
                        name: fileType,
                        extensions: [fileExtension],
                    },
                    {
                        name: 'All Files',
                        extensions: ['*'],
                    },
                ],
            });
        });
    }
}
function setSaveDiagramAsListener() {
    var _this = this;
    ipcMain.on('open_save-diagram-as_dialog', function (event) { return __awaiter(_this, void 0, void 0, function () {
        var saveDialogResult, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, dialog.showSaveDialog({
                        filters: [
                            {
                                name: 'BPMN',
                                extensions: ['bpmn', 'xml'],
                            },
                            {
                                name: 'All Files',
                                extensions: ['*'],
                            },
                        ],
                    })];
                case 1:
                    saveDialogResult = _a.sent();
                    filePath = saveDialogResult.canceled ? undefined : saveDialogResult.filePath;
                    event.sender.send('save_diagram_as', filePath);
                    return [2];
            }
        });
    }); });
}
function setOpenDiagramListener() {
    ipcMain.on('open_diagram', function (event) {
        var openedFile = dialog.showOpenDialogSync({
            filters: [
                {
                    name: 'BPMN',
                    extensions: ['bpmn', 'xml'],
                },
                {
                    name: 'XML',
                    extensions: ['bpmn', 'xml'],
                },
                {
                    name: 'All Files',
                    extensions: ['*'],
                },
            ],
        });
        event.sender.send('import_opened_diagram', openedFile);
    });
}
function setOpenSolutionsListener() {
    ipcMain.on('open_solution', function (event) {
        var openedFile = dialog.showOpenDialogSync({
            properties: ['openDirectory', 'createDirectory'],
        });
        event.sender.send('import_opened_solution', openedFile);
    });
}
function setElectronMenubar() {
    showFilteredMenuEntries(false, false);
    ipcMain.on('menu_hide-diagram-related-entries', function () {
        showFilteredMenuEntries(false, false);
    });
    ipcMain.on('menu_hide-save-entries', function () {
        showFilteredMenuEntries(false, true);
    });
    ipcMain.on('menu_show-all-menu-entries', function () {
        showAllMenuEntries();
    });
}
function showAllMenuEntries() {
    var template = [getApplicationMenu(), getFileMenu(), getEditMenu(), getWindowMenu(), getHelpMenu()];
    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
}
function showFilteredMenuEntries(showSaveButtons, showExportButton) {
    var filteredFileMenu = getFilteredFileMenu(showSaveButtons, showExportButton);
    var template = [getApplicationMenu(), filteredFileMenu, getEditMenu(), getWindowMenu(), getHelpMenu()];
    electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
}
function getFilteredFileMenu(showSaveButtons, showExportButton) {
    var previousEntryIsSeparator = false;
    var unfilteredFileMenu = getFileMenu();
    var filteredFileSubmenuItems = unfilteredFileMenu.submenu.items.filter(function (submenuEntry) {
        var isSeparator = submenuEntry.type !== undefined && submenuEntry.type === 'separator';
        if (isSeparator) {
            if (previousEntryIsSeparator) {
                return false;
            }
            previousEntryIsSeparator = true;
            return true;
        }
        var isSaveButton = submenuEntry.label !== undefined && submenuEntry.label.startsWith('Save');
        if (isSaveButton && !showSaveButtons) {
            return false;
        }
        var isExportButton = submenuEntry.label !== undefined && submenuEntry.label.startsWith('Export');
        if (isExportButton && !showExportButton) {
            return false;
        }
        previousEntryIsSeparator = false;
        return true;
    });
    var newFileSubmenu = electron.Menu.buildFromTemplate(filteredFileSubmenuItems);
    var menuOptions = {
        label: 'File',
        submenu: newFileSubmenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getApplicationMenu() {
    var submenuOptions = [
        {
            label: "About " + getProductName(),
            click: function () {
                about_window_1.default(getAboutWindowInfo());
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Preferences',
            click: function () {
                browserWindow.webContents.send('menubar__open_preferences');
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Quit',
            role: 'quit',
        },
    ];
    var submenu = electron.Menu.buildFromTemplate(submenuOptions);
    var menuOptions = {
        label: getProductName(),
        submenu: submenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getFileMenu() {
    var submenuOptions = [
        {
            label: 'New Diagram',
            accelerator: 'CmdOrCtrl+N',
            click: function () {
                browserWindow.webContents.send('menubar__start_create_diagram');
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Open Diagram',
            accelerator: 'CmdOrCtrl+O',
            click: function () {
                browserWindow.webContents.send('menubar__start_opening_diagram');
            },
        },
        {
            label: 'Open Solution',
            accelerator: 'CmdOrCtrl+Shift+O',
            click: function () {
                browserWindow.webContents.send('menubar__start_opening_solution');
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Save Diagram',
            accelerator: 'CmdOrCtrl+S',
            click: function () {
                browserWindow.webContents.send('menubar__start_save_diagram');
            },
        },
        {
            label: 'Save Diagram As...',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: function () {
                browserWindow.webContents.send('menubar__start_save_diagram_as');
            },
        },
        {
            label: 'Save All Diagrams',
            accelerator: 'CmdOrCtrl+Alt+S',
            click: function () {
                browserWindow.webContents.send('menubar__start_save_all_diagrams');
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Export Diagram As...',
            submenu: [
                {
                    label: 'BPMN',
                    click: function () {
                        browserWindow.webContents.send('menubar__epxort_diagram_as', 'BPMN');
                    },
                },
                {
                    label: 'SVG',
                    click: function () {
                        browserWindow.webContents.send('menubar__epxort_diagram_as', 'SVG');
                    },
                },
                {
                    label: 'PNG',
                    click: function () {
                        browserWindow.webContents.send('menubar__epxort_diagram_as', 'PNG');
                    },
                },
                {
                    label: 'JPEG',
                    click: function () {
                        browserWindow.webContents.send('menubar__epxort_diagram_as', 'JPEG');
                    },
                },
            ],
        },
        {
            type: 'separator',
        },
        {
            label: 'Close Diagram',
            accelerator: 'CmdOrCtrl+W',
            click: function () {
                browserWindow.webContents.send('menubar__start_close_diagram');
            },
        },
        {
            label: 'Close All Diagrams',
            accelerator: 'CmdOrCtrl+Alt+W',
            click: function () {
                browserWindow.webContents.send('menubar__start_close_all_diagrams');
            },
        },
    ];
    var submenu = electron.Menu.buildFromTemplate(submenuOptions);
    var menuOptions = {
        label: 'File',
        submenu: submenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getEditMenu() {
    var submenuOptions = [
        {
            label: 'Undo',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo',
        },
        {
            label: 'Redo',
            accelerator: 'CmdOrCtrl+Shift+Z',
            role: 'redo',
        },
        {
            type: 'separator',
        },
        {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut',
        },
        {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy',
        },
        {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste',
        },
        {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectAll',
        },
    ];
    var submenu = electron.Menu.buildFromTemplate(submenuOptions);
    var menuOptions = {
        label: 'Edit',
        submenu: submenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getWindowMenu() {
    var submenuOptions = [
        {
            role: 'minimize',
        },
        {
            role: 'close',
        },
        {
            type: 'separator',
        },
        {
            role: 'reload',
        },
    ];
    var submenu = electron.Menu.buildFromTemplate(submenuOptions);
    var menuOptions = {
        label: 'Window',
        submenu: submenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getHelpMenu() {
    var _this = this;
    var submenuOptions = [
        {
            label: 'Getting Started',
            click: function () {
                var documentationUrl = 'https://www.process-engine.io/docs/getting-started/';
                electron.shell.openExternal(documentationUrl);
            },
        },
        {
            label: 'BPMN Element Documentation',
            click: function () {
                var currentVersionBranch = getBranchOfCurrentVersion();
                var elementDocumentationUrl = "https://github.com/process-engine/bpmn-studio/blob/" + currentVersionBranch + "/doc/bpmn-elements.md";
                electron.shell.openExternal(elementDocumentationUrl);
            },
        },
        {
            label: 'Release Notes',
            click: function () {
                var currentVersion = app.getVersion();
                var currentReleaseNotesUrl = "https://github.com/process-engine/bpmn-studio/releases/tag/v" + currentVersion;
                electron.shell.openExternal(currentReleaseNotesUrl);
            },
        },
        {
            type: 'separator',
        },
        {
            label: 'Developer Support',
            submenu: [
                {
                    role: 'toggleDevTools',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Export Databases to ZIP File ...',
                    click: function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4, exportDatabases()];
                                case 1:
                                    _a.sent();
                                    return [3, 3];
                                case 2:
                                    error_1 = _a.sent();
                                    browserWindow.webContents.send('database-export-error', error_1.message);
                                    return [3, 3];
                                case 3: return [2];
                            }
                        });
                    }); },
                },
                {
                    label: 'Open Folder for Databases',
                    click: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            electron.shell.openItem(getConfigFolder());
                            return [2];
                        });
                    }); },
                },
            ],
        },
        {
            type: 'separator',
        },
        {
            label: 'Feedback',
            click: function () {
                browserWindow.webContents.send('show-feedback-modal');
            },
        },
    ];
    var submenu = electron.Menu.buildFromTemplate(submenuOptions);
    var menuOptions = {
        label: 'Help',
        submenu: submenu,
    };
    return new electron_1.MenuItem(menuOptions);
}
function getAboutWindowInfo() {
    var copyrightYear = new Date().getFullYear();
    return {
        icon_path: releaseChannel.isDev()
            ? path_1.default.join(__dirname, '../../../build/icon.png')
            : path_1.default.join(__dirname, '../../../../../build/icon.png'),
        product_name: getProductName(),
        bug_report_url: 'https://github.com/process-engine/bpmn-studio/issues/new',
        homepage: 'www.process-engine.io',
        copyright: "Copyright \u00A9 " + copyrightYear + " process-engine",
        win_options: {
            minimizable: false,
            maximizable: false,
            resizable: false,
        },
        package_json_dir: __dirname,
    };
}
function startInternalProcessEngine() {
    return __awaiter(this, void 0, void 0, function () {
        var devUserDataFolderPath, prodUserDataFolderPath, userDataFolderPath, configForGetPort, port, processEngineDatabaseFolderName, processEngineStatusListeners, internalProcessEngineStatus, internalProcessEngineStartupError, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    devUserDataFolderPath = path_1.default.join(__dirname, '..', 'userData');
                    prodUserDataFolderPath = app.getPath('userData');
                    userDataFolderPath = releaseChannel.isDev() ? devUserDataFolderPath : prodUserDataFolderPath;
                    if (!releaseChannel.isDev()) {
                        process.env.CONFIG_PATH = path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'config');
                    }
                    configForGetPort = {
                        port: default_ports_module_1.getPortListByVersion(releaseChannel.getVersion()),
                        host: '0.0.0.0',
                    };
                    console.log('Trying to start internal ProcessEngine on ports:', configForGetPort);
                    return [4, get_port_1.default(configForGetPort)];
                case 1:
                    port = _a.sent();
                    console.log("Internal ProcessEngine starting on port " + port + ".");
                    process.env.http__http_extension__server__port = "" + port;
                    processEngineDatabaseFolderName = getProcessEngineDatabaseFolderName();
                    process.env.process_engine__process_model_repository__storage = path_1.default.join(userDataFolderPath, processEngineDatabaseFolderName, 'process_model.sqlite');
                    process.env.process_engine__flow_node_instance_repository__storage = path_1.default.join(userDataFolderPath, processEngineDatabaseFolderName, 'flow_node_instance.sqlite');
                    process.env.process_engine__timer_repository__storage = path_1.default.join(userDataFolderPath, processEngineDatabaseFolderName, 'timer.sqlite');
                    processEngineStatusListeners = [];
                    ipcMain.on('add_internal_processengine_status_listener', function (event) {
                        if (!processEngineStatusListeners.includes(event.sender)) {
                            processEngineStatusListeners.push(event.sender);
                        }
                        if (internalProcessEngineStatus !== undefined) {
                            sendInternalProcessEngineStatus(event.sender, internalProcessEngineStatus, internalProcessEngineStartupError);
                        }
                    });
                    ipcMain.on('get_host', function (event) {
                        event.returnValue = "localhost:" + port;
                    });
                    ipcMain.on('get_version', function (event) {
                        event.returnValue = package_json_1.version;
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4, startRuntime()];
                case 3:
                    _a.sent();
                    runtimeProcess.on('close', function (code) {
                        var error = new Error("Runtime exited with code " + code);
                        console.error(error);
                    });
                    runtimeProcess.on('error', function (err) {
                        var error = new Error(err.toString());
                        console.error('Internal ProcessEngine Error: ', error);
                    });
                    console.log('Internal ProcessEngine started successfully.');
                    internalProcessEngineStatus = 'success';
                    publishProcessEngineStatus(processEngineStatusListeners, internalProcessEngineStatus, internalProcessEngineStartupError);
                    return [3, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Failed to start internal ProcessEngine: ', error_2);
                    internalProcessEngineStatus = 'error';
                    internalProcessEngineStartupError = peErrors += error_2;
                    publishProcessEngineStatus(processEngineStatusListeners, internalProcessEngineStatus, internalProcessEngineStartupError);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
function startRuntime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var sqlitePath = getProcessEngineDatabaseFolder();
                    var logFilepath = getProcessEngineLogFolder();
                    var pathToRuntime = path_1.default.join(__dirname, '..', '..', '..', 'node_modules', '@process-engine', 'process_engine_runtime', 'bin', 'index.js');
                    runtimeProcess = child_process_1.fork(pathToRuntime, ["--sqlitePath=" + sqlitePath, "--logFilePath=" + logFilepath], {
                        stdio: 'pipe',
                    });
                    runtimeProcess.stdout.on('data', function (data) { return process.stdout.write(data); });
                    runtimeProcess.stderr.on('data', function (data) {
                        process.stderr.write(data);
                        peErrors += data.toString();
                    });
                    runtimeProcess.on('message', function (message) {
                        if (message === 'started') {
                            resolve();
                        }
                    });
                    runtimeProcess.on('close', function (code) {
                        var error = new Error("Runtime exited with code " + code);
                        reject(error);
                    });
                    runtimeProcess.on('error', function (err) {
                        reject(err);
                    });
                })];
        });
    });
}
function getProcessEngineLogFolder() {
    return path_1.default.join(getConfigFolder(), getProcessEngineLogFolderName());
}
function getProcessEngineLogFolderName() {
    return 'process_engine_logs';
}
function getProcessEngineDatabaseFolder() {
    return path_1.default.join(getConfigFolder(), getProcessEngineDatabaseFolderName());
}
function getProcessEngineDatabaseFolderName() {
    return 'process_engine_databases';
}
function sendInternalProcessEngineStatus(sender, internalProcessEngineStatus, internalProcessEngineStartupError) {
    var serializedStartupError;
    var processEngineStartHasFailed = internalProcessEngineStartupError !== undefined && internalProcessEngineStartupError !== null;
    if (processEngineStartHasFailed) {
        if (typeof internalProcessEngineStartupError === 'string') {
            serializedStartupError = internalProcessEngineStartupError;
        }
        else {
            serializedStartupError = JSON.stringify(internalProcessEngineStartupError, Object.getOwnPropertyNames(internalProcessEngineStartupError));
        }
    }
    else {
        serializedStartupError = undefined;
    }
    sender.send('internal_processengine_status', internalProcessEngineStatus, serializedStartupError);
}
function publishProcessEngineStatus(processEngineStatusListeners, internalProcessEngineStatus, internalProcessEngineStartupError) {
    processEngineStatusListeners.forEach(function (processEngineStatusLisener) {
        sendInternalProcessEngineStatus(processEngineStatusLisener, internalProcessEngineStatus, internalProcessEngineStartupError);
    });
}
function getConfigFolder() {
    var configPath = "bpmn-studio" + getConfigPathSuffix();
    return path_1.default.join(getUserConfigFolder(), configPath);
}
function getConfigPathSuffix() {
    if (process.env.SPECTRON_TESTS) {
        return '-tests';
    }
    if (releaseChannel.isDev()) {
        return '-dev';
    }
    if (releaseChannel.isAlpha()) {
        return '-alpha';
    }
    if (releaseChannel.isBeta()) {
        return '-beta';
    }
    if (releaseChannel.isStable()) {
        return '';
    }
    throw new Error('Could not get config path suffix for internal process engine');
}
function getBranchOfCurrentVersion() {
    if (releaseChannel.isDev()) {
        return 'develop';
    }
    if (releaseChannel.isAlpha()) {
        return 'develop';
    }
    if (releaseChannel.isBeta()) {
        return 'beta';
    }
    if (releaseChannel.isStable()) {
        return 'master';
    }
    throw new Error('Could not get the branch of the current version.');
}
function getUserConfigFolder() {
    var userHomeDir = os_1.homedir();
    switch (process.platform) {
        case 'darwin':
            return path_1.default.join(userHomeDir, 'Library', 'Application Support');
        case 'win32':
            return path_1.default.join(userHomeDir, 'AppData', 'Roaming');
        default:
            return path_1.default.join(userHomeDir, '.config');
    }
}
function bringExistingInstanceToForeground() {
    if (browserWindow) {
        if (browserWindow.isMinimized()) {
            browserWindow.restore();
        }
        browserWindow.focus();
    }
}
function exportDatabases() {
    return __awaiter(this, void 0, void 0, function () {
        var zip, now, defaultFilename, pathToSaveTo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = new jszip_1.default();
                    addFolderToZip(zip, getProcessEngineDatabaseFolderName(), getProcessEngineDatabaseFolder());
                    now = new Date().toISOString().replace(/:/g, '-');
                    defaultFilename = "database-backup-" + now + ".zip";
                    return [4, getPathToSaveTo(defaultFilename)];
                case 1:
                    pathToSaveTo = _a.sent();
                    if (!pathToSaveTo) {
                        return [2];
                    }
                    zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
                        fs_1.default.writeFileSync(pathToSaveTo, content);
                    });
                    return [2];
            }
        });
    });
}
function createFeedbackZip(feedbackData) {
    return __awaiter(this, void 0, void 0, function () {
        var zip, feedbackFolder, processEngineFolder, processEngineFolder, bugsProvided, suggestionsProvided, diagramsProvided, diagramFolder_1, additionalDiagramInformationProvided, now, defaultFilename, pathToSaveTo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = new jszip_1.default();
                    feedbackFolder = zip.folder('feedback');
                    if (feedbackData.attachInternalDatabases) {
                        processEngineFolder = feedbackFolder.folder('InternalProcessEngine');
                        addFolderToZip(processEngineFolder, getProcessEngineDatabaseFolderName(), getProcessEngineDatabaseFolder());
                    }
                    if (feedbackData.attachProcessEngineLogs) {
                        processEngineFolder = feedbackFolder.folder('InternalProcessEngine');
                        addFolderToZip(processEngineFolder, getProcessEngineLogFolderName(), getProcessEngineLogFolder());
                    }
                    bugsProvided = feedbackData.bugs.trim() !== '';
                    if (bugsProvided) {
                        feedbackFolder.file('Bugs.txt', feedbackData.bugs);
                    }
                    suggestionsProvided = feedbackData.suggestions.trim() !== '';
                    if (suggestionsProvided) {
                        feedbackFolder.file('Suggestions.txt', feedbackData.suggestions);
                    }
                    diagramsProvided = feedbackData.diagrams.length > 0;
                    if (diagramsProvided) {
                        diagramFolder_1 = feedbackFolder.folder('diagrams');
                        feedbackData.diagrams.forEach(function (diagram) {
                            var diagramSolution = '';
                            if (solution_is_remote_solution_module_1.solutionIsRemoteSolution(diagram.uri)) {
                                var diagramUriWithoutProtocol = diagram.uri.substring(diagram.uri.indexOf('/') + 2);
                                var diagramUriWithoutProtocolAndLocation = diagramUriWithoutProtocol.substring(0, diagramUriWithoutProtocol.indexOf('/'));
                                var diagramUriWithoutProtocolAndLocationWithEscapedPort = diagramUriWithoutProtocolAndLocation.replace(':', '__');
                                diagramSolution = diagramUriWithoutProtocolAndLocationWithEscapedPort;
                            }
                            else {
                                var escapedDiagramUri = diagram.uri.substring(0, diagram.uri.lastIndexOf('/')).replace(/[/\\]/g, '__');
                                diagramSolution = escapedDiagramUri.startsWith('__') ? escapedDiagramUri.replace('__', '') : escapedDiagramUri;
                            }
                            var solutionFolder = diagramFolder_1.folder(diagramSolution);
                            var diagramName = "" + diagram.name + (diagram.name.endsWith('.bpmn') || diagram.name.endsWith('.xml') ? '' : '.bpmn');
                            solutionFolder.file(diagramName, diagram.xml);
                        });
                        additionalDiagramInformationProvided = feedbackData.additionalDiagramInformation.trim() !== '';
                        if (additionalDiagramInformationProvided) {
                            diagramFolder_1.file('Additional Diagram Information.txt', feedbackData.additionalDiagramInformation);
                        }
                    }
                    now = new Date().toISOString().replace(/:/g, '-');
                    defaultFilename = "feedback-" + now + ".zip";
                    return [4, getPathToSaveTo(defaultFilename)];
                case 1:
                    pathToSaveTo = _a.sent();
                    if (!pathToSaveTo) {
                        return [2];
                    }
                    zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
                        fs_1.default.writeFileSync(pathToSaveTo, content);
                    });
                    return [2];
            }
        });
    });
}
function getNamesOfFilesAndFoldersInFolder(foldername) {
    return fs_1.default.readdirSync(foldername, { withFileTypes: true });
}
function getPathToSaveTo(defaultFilename) {
    return __awaiter(this, void 0, void 0, function () {
        var downloadPath, defaultPath, saveDialogResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    downloadPath = electron.app.getPath('downloads');
                    defaultPath = path_1.default.join(downloadPath, defaultFilename);
                    return [4, dialog.showSaveDialog({
                            defaultPath: defaultPath,
                            filters: [
                                {
                                    name: 'zip',
                                    extensions: ['zip'],
                                },
                                {
                                    name: 'All Files',
                                    extensions: ['*'],
                                },
                            ],
                        })];
                case 1:
                    saveDialogResult = _a.sent();
                    if (saveDialogResult.canceled) {
                        return [2, undefined];
                    }
                    return [2, saveDialogResult.filePath];
            }
        });
    });
}
function addFolderToZip(zipFolder, folderName, folderPath) {
    if (!fs_1.default.existsSync(folderPath)) {
        zipFolder.file(folderName + " does not exist.", '', { base64: true });
        return;
    }
    var folderInZip = zipFolder.folder(folderName);
    var filesAndFoldersInFolder = getNamesOfFilesAndFoldersInFolder(folderPath);
    filesAndFoldersInFolder.forEach(function (fileOrFolder) {
        var currentElementsPath = folderPath + "/" + fileOrFolder.name;
        if (fileOrFolder.isDirectory()) {
            addFolderToZip(folderInZip, fileOrFolder.name, currentElementsPath);
        }
        else {
            addFileToZip(folderInZip, fileOrFolder.name, currentElementsPath);
        }
    });
}
function addFileToZip(zipFolder, filename, filePath) {
    zipFolder.file(filename, fs_1.default.readFileSync(filePath), { base64: true });
}
execute();
//# sourceMappingURL=electron.js.map