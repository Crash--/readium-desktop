// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import { OPDS } from "readium-desktop/common/models/opds";

import { Action } from "readium-desktop/common/models/redux";

export enum ActionType {
    SetRequest = "OPDS_SET_REQUEST",
    SetError = "OPDS_SET_ERROR",
    SetSuccess = "OPDS_SET_SUCCESS",
    AddRequest = "OPDS_ADD_REQUEST",
    AddError = "OPDS_ADD_ERROR",
    AddSuccess = "OPDS_ADD_SUCCESS",
    RemoveRequest = "OPDS_REMOVE_REQUEST",
    RemoveError = "OPDS_REMOVE_ERROR",
    RemoveSuccess = "OPDS_REMOVE_SUCCESS",
    UpdateRequest = "OPDS_UPDATE_REQUEST",
    UpdateError = "OPDS_UPDATE_ERROR",
    UpdateSuccess = "OPDS_UPDATE_SUCCESS",
}

export function add(opds: OPDS): Action {
    return {
        type: ActionType.AddRequest,
        payload: {
            item: opds,
        },
    };
}

export function update(opds: OPDS): Action {
    return {
        type: ActionType.UpdateRequest,
        payload: {
            item: opds,
        },
    };
}

export function remove(opds: OPDS): Action {
    return {
        type: ActionType.RemoveRequest,
        payload: {
            item: opds,
        },
    };
}
