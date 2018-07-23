// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import { Store } from "redux";

import Dialog from "material-ui/Dialog";
import Divider from "material-ui/Divider";
import DropDownMenu from "material-ui/DropDownMenu";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
//import Menu from "material-ui/Menu";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";

//import MenuItem from "material-ui/MenuItem";
//import Popover from "material-ui/Popover";
import { blue500 } from "material-ui/styles/colors";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "material-ui/Toolbar";

import FlatButton from "material-ui/FlatButton";

import { lazyInject } from "readium-desktop/renderer/di";

import { catalogActions } from "readium-desktop/common/redux/actions";
import { setLocale } from "readium-desktop/common/redux/actions/i18n";
import { Translator } from "readium-desktop/common/services/translator";
import { RootState } from "readium-desktop/renderer/redux/states";

import { UpdateStatus } from "readium-desktop/common/redux/states/update";

import * as classNames from "classnames";
import AddIcon from "readium-desktop/renderer/assets/icons/add.svg";
import GiftIcon from "readium-desktop/renderer/assets/icons/gift.svg";
import InfoIcon from "readium-desktop/renderer/assets/icons/info.svg";
import MenuIcon from "readium-desktop/renderer/assets/icons/menu.svg";
import OPDSIcon from "readium-desktop/renderer/assets/icons/opds.svg";
import QuestionIcon from "readium-desktop/renderer/assets/icons/question.svg";

import * as CNLLogoUrl from "readium-desktop/renderer/assets/logos/cnl.png";

import * as AppBarStyles from "readium-desktop/renderer/assets/styles/app-bar.css";
import * as AppStyles from "readium-desktop/renderer/assets/styles/app.css";
import CollectionDialog from "readium-desktop/renderer/components/opds/CollectionDialog";

import { OPDS } from "readium-desktop/common/models/opds";

import { OpdsForm } from "readium-desktop/renderer/components/opds/index";

import * as deDocs from "readium-desktop/resources/docs/de";
import * as enDocs from "readium-desktop/resources/docs/en";
import * as frDocs from "readium-desktop/resources/docs/fr";

import {
    _APP_VERSION,
    _GIT_BRANCH,
    _GIT_DATE,
    _GIT_SHORT
} from "readium-desktop/preprocessor-directives";

interface AppToolbarState {
    update: boolean;
    latestVersionUrl: string;
    locale: string;
    open: boolean;
    aboutOpen: boolean;
    dialogContent: string;
    opdsImportOpen: boolean;
    opdsUrl: string;
    opdsName: string;
    opds: OPDS;
    localeList: any;

    localeOpen: boolean;
    localAnchorEl: Element;
    opdsOpen: boolean;
    opdsAnchorEl: Element;
    otherOpen: boolean;
    otherAnchorEl: Element;
}

interface AppToolbarProps {
    openDialog: (content: JSX.Element, stuff: any, things: any[]) => void;
    closeDialog: () => void;
    opdsList: OPDS[];
}

export default class AppToolbar extends React.Component<
    AppToolbarProps,
    AppToolbarState
> {
    public state: AppToolbarState;

    @lazyInject("store") private store: Store<RootState>;

    @lazyInject("translator") private translator: Translator;

    private addEpubInput: any;

    constructor(props: AppToolbarProps) {
        super(props);
        this.state = {
            update: false,
            latestVersionUrl: null,
            dialogContent: undefined,
            locale: this.store.getState().i18n.locale,
            open: false,
            aboutOpen: false,
            opdsImportOpen: false,
            opdsUrl: undefined,
            opdsName: undefined,
            opds: undefined,
            localeList: {
                fr: "Français",
                en: "English",
                de: "Deutsch"
            },

            localeOpen: false,
            localAnchorEl: undefined,
            opdsOpen: false,
            opdsAnchorEl: undefined,
            otherOpen: false,
            otherAnchorEl: undefined
        };

        this.handleLocaleChange = this.handleLocaleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    public componentDidMount() {
        this.store.subscribe(() => {
            const storeState = this.store.getState();

            if (
                storeState.update.status === UpdateStatus.Update ||
                storeState.update.status === UpdateStatus.SecurityUpdate
            ) {
                this.setState({
                    update: true,
                    latestVersionUrl: storeState.update.latestVersionUrl
                });
            }
        });
    }

    public render(): React.ReactElement<{}> {
        const __ = this.translator.translate.bind(this.translator);

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose.bind(this)}
            />
        ];

        // Use en as default language
        let docs = enDocs;
        if (this.state.locale === "fr") {
            docs = frDocs;
        } else if (this.state.locale === "de") {
            docs = deDocs;
        }

        const helpContent = docs.help as any;
        const newsContent = docs.news as any;
        const aboutContent = docs.about as any;

        const listOPDS: JSX.Element[] = [];
        let i = 0;
        if (this.props.opdsList !== undefined) {
            for (const newOpds of this.props.opdsList.sort(this.sort)) {
                listOPDS.push(
                    <MenuItem
                        key={i}
                        //primaryText={newOpds.name}
                        onClick={() => {
                            this.setState({
                                opdsImportOpen: true,
                                opds: newOpds,
                                opdsOpen: false
                            });
                        }}
                    />
                );
                i++;
            }
        }
        const allMenuItems: JSX.Element[] = [];

        allMenuItems.push(...listOPDS);
        allMenuItems.push(<Divider key={i} />);
        i++;
        allMenuItems.push(
            <MenuItem
                key={i}
                // primaryText={__("opds.addMenu")}
                onClick={() => {
                    this.handleOpdsClose();
                    this.props.openDialog(
                        <OpdsForm closeDialog={this.props.closeDialog} />,
                        null,
                        []
                    );
                }}
            />
        );
        i++;
        return (
            <div>
                <div className={AppBarStyles.root}>
                    <MenuList className={AppBarStyles.rootMenu}>
                        <MenuItem
                            // primaryText={}
                            onClick={() => {
                                this.handleLocaleChange("fr");
                            }}
                            style={{ height: "38px" }}
                        >
                            <span className={AppStyles.primarytextcolor}>
                                {__("Mes livres")}
                            </span>
                        </MenuItem>
                        <MenuItem
                            //primaryText={__("Catalogues")}
                            onClick={() => {
                                this.handleLocaleChange("fr");
                            }}
                            style={{ height: "38px" }}
                        >
                            <span className={AppStyles.secondtextcolor}>
                                {__("Catalogues")}
                            </span>
                        </MenuItem>
                        <MenuItem
                            //primaryText={__("Préférences")}
                            onClick={() => {
                                this.handleLocaleChange("fr");
                            }}
                            style={{ height: "38px" }}
                        >
                            <span className={AppStyles.secondtextcolor}>
                                {__("Préférences")}
                            </span>
                        </MenuItem>
                    </MenuList>
                </div>
            </div>
        );
    }

    private handleLocalOpen(event: any) {
        this.setState({ localAnchorEl: event.currentTarget, localeOpen: true });
    }

    private handleLocalClose() {
        this.setState({ localeOpen: false });
    }

    private handleOpdsOpen(event: any) {
        this.setState({ opdsAnchorEl: event.currentTarget, opdsOpen: true });
    }

    private handleOpdsClose() {
        this.setState({ opdsOpen: false });
    }

    private handleOtherOpen(event: any) {
        this.setState({ otherAnchorEl: event.currentTarget, otherOpen: true });
    }

    private handleOtherClose() {
        this.setState({ otherOpen: false });
    }

    private handleOpen = (content: string, replacements: any) => {
        for (const replacement of replacements) {
            content = content.replace(replacement.from, replacement.to);
        }

        this.setState({ open: true });
        this.setState({ dialogContent: content, otherOpen: false });
    };

    private handleClose = () => {
        this.setState({ open: false });
    };

    private handleLocaleChange(locale: string) {
        this.store.dispatch(setLocale(locale));
        this.setState({ locale, localeOpen: false });
    }

    private handleFileChange(event: any) {
        const files: FileList = event.target.files;

        for (const file of Array.from(files)) {
            this.store.dispatch(catalogActions.importFile(file.path));
        }

        this.addEpubInput.value = "";
    }

    private closeCollectionDialog() {
        this.setState({ opdsImportOpen: false });
    }

    private sort(a: OPDS, b: OPDS) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name === b.name) {
            return 0;
        } else {
            return -1;
        }
    }

    private updateDisplay(newOpds: OPDS) {
        this.setState({ opds: newOpds });
    }
}
