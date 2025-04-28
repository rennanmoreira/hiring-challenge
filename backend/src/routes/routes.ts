/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PlantController } from './../controllers/PlantController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PartController } from './../controllers/PartController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EquipmentController } from './../controllers/EquipmentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EquipmentAreaController } from './../controllers/EquipmentAreaController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AreaNeighborController } from './../controllers/AreaNeighborController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AreaController } from './../controllers/AreaController';
import { expressAuthentication } from './../middleware/authentication';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Pick_User.Exclude_keyofUser.passwordHash__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"name":{"dataType":"string"},"isActive":{"dataType":"boolean","required":true},"createdAt":{"dataType":"datetime","required":true},"updatedAt":{"dataType":"datetime","required":true},"deletedAt":{"dataType":"datetime"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_User.passwordHash_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_User.Exclude_keyofUser.passwordHash__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_User.username-or-email-or-passwordHash-or-name_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"passwordHash":{"dataType":"string","required":true},"username":{"dataType":"string","required":true},"email":{"dataType":"string","required":true},"name":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "user": {"ref":"Omit_User.passwordHash_","required":true},
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InvalidDataError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "username": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_User.username-or-email-or-name-or-isActive__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"username":{"dataType":"string"},"email":{"dataType":"string"},"name":{"dataType":"string"},"isActive":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserNotFoundError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "currentPassword": {"dataType":"string","required":true},
            "newPassword": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Plant": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "areas": {"dataType":"array","array":{"dataType":"refObject","ref":"Area"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Area": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "locationDescription": {"dataType":"string","required":true},
            "plant": {"ref":"Plant"},
            "plantId": {"dataType":"string","required":true},
            "equipment": {"dataType":"array","array":{"dataType":"refObject","ref":"Equipment"}},
            "neighbors": {"dataType":"array","array":{"dataType":"refObject","ref":"AreaNeighbor"}},
            "neighborOf": {"dataType":"array","array":{"dataType":"refObject","ref":"AreaNeighbor"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PartType": {
        "dataType": "refEnum",
        "enums": ["electric","electronic","mechanical","hydraulical"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Equipment": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "initialOperationsDate": {"dataType":"datetime","required":true},
            "area": {"ref":"Area"},
            "areaId": {"dataType":"string","required":true},
            "parts": {"dataType":"array","array":{"dataType":"refObject","ref":"Part"}},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Part": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "type": {"ref":"PartType","required":true},
            "manufacturer": {"dataType":"string","required":true},
            "serialNumber": {"dataType":"string","required":true},
            "installationDate": {"dataType":"datetime","required":true},
            "equipment": {"ref":"Equipment"},
            "equipmentId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "username": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "passwordHash": {"dataType":"string","required":true},
            "name": {"dataType":"string"},
            "isActive": {"dataType":"boolean","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AreaNeighbor": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "area": {"ref":"Area","required":true},
            "areaId": {"dataType":"string","required":true},
            "neighborArea": {"ref":"Area","required":true},
            "neighborAreaId": {"dataType":"string","required":true},
            "createdByUser": {"ref":"User","required":true},
            "createdByUserId": {"dataType":"string","required":true},
            "updatedByUser": {"ref":"User"},
            "updatedByUserId": {"dataType":"string"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Plant.name-or-address_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"address":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Plant.name-or-address__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"address":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"type":{"ref":"PartType","required":true},"manufacturer":{"dataType":"string","required":true},"serialNumber":{"dataType":"string","required":true},"installationDate":{"dataType":"datetime","required":true},"equipment":{"ref":"Equipment"},"equipmentId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Part.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Part.Exclude_keyofPart.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Part.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"type":{"ref":"PartType"},"manufacturer":{"dataType":"string"},"serialNumber":{"dataType":"string"},"installationDate":{"dataType":"datetime"},"equipment":{"ref":"Equipment"},"equipmentId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Equipment.Exclude_keyofEquipment.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"manufacturer":{"dataType":"string","required":true},"serialNumber":{"dataType":"string","required":true},"initialOperationsDate":{"dataType":"datetime","required":true},"area":{"ref":"Area"},"areaId":{"dataType":"string","required":true},"parts":{"dataType":"array","array":{"dataType":"refObject","ref":"Part"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Equipment.id-or-createdAt-or-updatedAt_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Equipment.Exclude_keyofEquipment.id-or-createdAt-or-updatedAt__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Omit_Equipment.id-or-createdAt-or-updatedAt__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"manufacturer":{"dataType":"string"},"serialNumber":{"dataType":"string"},"initialOperationsDate":{"dataType":"datetime"},"area":{"ref":"Area"},"areaId":{"dataType":"string"},"parts":{"dataType":"array","array":{"dataType":"refObject","ref":"Part"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EquipmentArea": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "equipment": {"ref":"Equipment","required":true},
            "equipmentId": {"dataType":"string","required":true},
            "area": {"ref":"Area","required":true},
            "areaId": {"dataType":"string","required":true},
            "createdByUser": {"ref":"User","required":true},
            "createdByUserId": {"dataType":"string","required":true},
            "updatedByUser": {"ref":"User"},
            "updatedByUserId": {"dataType":"string"},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"datetime","required":true},
            "deletedAt": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApiError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "status": {"dataType":"double","required":true},
            "type": {"dataType":"string","required":true},
            "details": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_EquipmentArea.equipmentId-or-areaId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipmentId":{"dataType":"string","required":true},"areaId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_EquipmentArea.equipmentId-or-areaId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"equipmentId":{"dataType":"string"},"areaId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ObjectLiteral": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"dataType":"any"},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateResult": {
        "dataType": "refObject",
        "properties": {
            "raw": {"dataType":"any","required":true},
            "affected": {"dataType":"double"},
            "generatedMaps": {"dataType":"array","array":{"dataType":"refObject","ref":"ObjectLiteral"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AreaNeighborNotFoundError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InvalidForeignKeyError": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "stack": {"dataType":"string"},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_AreaNeighbor.areaId-or-neighborAreaId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"areaId":{"dataType":"string","required":true},"neighborAreaId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_AreaNeighbor.areaId-or-neighborAreaId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"areaId":{"dataType":"string"},"neighborAreaId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Area.name-or-locationDescription-or-plantId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"locationDescription":{"dataType":"string","required":true},"plantId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Pick_Area.name-or-locationDescription__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string"},"locationDescription":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_getUsers: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
                isActive: {"in":"query","name":"isActive","dataType":"boolean"},
        };
        app.get('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUsers)),

            async function UserController_getUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUsers, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getCurrentUser: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.get('/users/me',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getCurrentUser)),

            async function UserController_getCurrentUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getCurrentUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getCurrentUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.get('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUser)),

            async function UserController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_User.username-or-email-or-passwordHash-or-name_"},
        };
        app.post('/users',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createUser)),

            async function UserController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_createUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginRequest"},
        };
        app.post('/users/login',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.login)),

            async function UserController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_login, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_User.username-or-email-or-name-or-isActive__"},
        };
        app.put('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUser)),

            async function UserController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_changePassword: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"ChangePasswordRequest"},
        };
        app.put('/users/:userId/password',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.changePassword)),

            async function UserController_changePassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_changePassword, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'changePassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_toggleUserStatus: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"isActive":{"dataType":"boolean","required":true}}},
        };
        app.put('/users/:userId/status',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.toggleUserStatus)),

            async function UserController_toggleUserStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_toggleUserStatus, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'toggleUserStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                userId: {"in":"path","name":"userId","required":true,"dataType":"string"},
        };
        app.delete('/users/:userId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deleteUser)),

            async function UserController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_getPlants: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlants)),

            async function PlantController_getPlants(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlants, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlants',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_getPlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.get('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.getPlant)),

            async function PlantController_getPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_getPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'getPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_createPlant: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Plant.name-or-address_"},
        };
        app.post('/plants',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.createPlant)),

            async function PlantController_createPlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_createPlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'createPlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_updatePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Plant.name-or-address__"},
        };
        app.put('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.updatePlant)),

            async function PlantController_updatePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_updatePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'updatePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPlantController_deletePlant: Record<string, TsoaRoute.ParameterSchema> = {
                plantId: {"in":"path","name":"plantId","required":true,"dataType":"string"},
        };
        app.delete('/plants/:plantId',
            ...(fetchMiddlewares<RequestHandler>(PlantController)),
            ...(fetchMiddlewares<RequestHandler>(PlantController.prototype.deletePlant)),

            async function PlantController_deletePlant(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPlantController_deletePlant, request, response });

                const controller = new PlantController();

              await templateService.apiHandler({
                methodName: 'deletePlant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getParts: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getParts)),

            async function PartController_getParts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getParts, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getParts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_getPartById: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.get('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.getPartById)),

            async function PartController_getPartById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_getPartById, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'getPartById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_createPart: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Part.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/parts',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.createPart)),

            async function PartController_createPart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_createPart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'createPart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_updatePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Part.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.updatePart)),

            async function PartController_updatePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_updatePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'updatePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPartController_deletePart: Record<string, TsoaRoute.ParameterSchema> = {
                partId: {"in":"path","name":"partId","required":true,"dataType":"string"},
        };
        app.delete('/parts/:partId',
            ...(fetchMiddlewares<RequestHandler>(PartController)),
            ...(fetchMiddlewares<RequestHandler>(PartController.prototype.deletePart)),

            async function PartController_deletePart(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPartController_deletePart, request, response });

                const controller = new PartController();

              await templateService.apiHandler({
                methodName: 'deletePart',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipment: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipment)),

            async function EquipmentController_getEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_getEquipmentById: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.get('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.getEquipmentById)),

            async function EquipmentController_getEquipmentById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_getEquipmentById, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'getEquipmentById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_createEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Omit_Equipment.id-or-createdAt-or-updatedAt_"},
        };
        app.post('/equipment',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.createEquipment)),

            async function EquipmentController_createEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_createEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'createEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_updateEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Omit_Equipment.id-or-createdAt-or-updatedAt__"},
        };
        app.put('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.updateEquipment)),

            async function EquipmentController_updateEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_updateEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'updateEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentController_deleteEquipment: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"path","name":"equipmentId","required":true,"dataType":"string"},
        };
        app.delete('/equipment/:equipmentId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentController.prototype.deleteEquipment)),

            async function EquipmentController_deleteEquipment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentController_deleteEquipment, request, response });

                const controller = new EquipmentController();

              await templateService.apiHandler({
                methodName: 'deleteEquipment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentAreaController_getEquipmentAreas: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentId: {"in":"query","name":"equipmentId","dataType":"string"},
                areaId: {"in":"query","name":"areaId","dataType":"string"},
        };
        app.get('/equipment-areas',
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController.prototype.getEquipmentAreas)),

            async function EquipmentAreaController_getEquipmentAreas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentAreaController_getEquipmentAreas, request, response });

                const controller = new EquipmentAreaController();

              await templateService.apiHandler({
                methodName: 'getEquipmentAreas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentAreaController_getEquipmentArea: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentAreaId: {"in":"path","name":"equipmentAreaId","required":true,"dataType":"string"},
        };
        app.get('/equipment-areas/:equipmentAreaId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController.prototype.getEquipmentArea)),

            async function EquipmentAreaController_getEquipmentArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentAreaController_getEquipmentArea, request, response });

                const controller = new EquipmentAreaController();

              await templateService.apiHandler({
                methodName: 'getEquipmentArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentAreaController_createEquipmentArea: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_EquipmentArea.equipmentId-or-areaId_"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/equipment-areas',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController.prototype.createEquipmentArea)),

            async function EquipmentAreaController_createEquipmentArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentAreaController_createEquipmentArea, request, response });

                const controller = new EquipmentAreaController();

              await templateService.apiHandler({
                methodName: 'createEquipmentArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentAreaController_updateEquipmentArea: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentAreaId: {"in":"path","name":"equipmentAreaId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_EquipmentArea.equipmentId-or-areaId__"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/equipment-areas/:equipmentAreaId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController.prototype.updateEquipmentArea)),

            async function EquipmentAreaController_updateEquipmentArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentAreaController_updateEquipmentArea, request, response });

                const controller = new EquipmentAreaController();

              await templateService.apiHandler({
                methodName: 'updateEquipmentArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEquipmentAreaController_deleteEquipmentArea: Record<string, TsoaRoute.ParameterSchema> = {
                equipmentAreaId: {"in":"path","name":"equipmentAreaId","required":true,"dataType":"string"},
        };
        app.delete('/equipment-areas/:equipmentAreaId',
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController)),
            ...(fetchMiddlewares<RequestHandler>(EquipmentAreaController.prototype.deleteEquipmentArea)),

            async function EquipmentAreaController_deleteEquipmentArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEquipmentAreaController_deleteEquipmentArea, request, response });

                const controller = new EquipmentAreaController();

              await templateService.apiHandler({
                methodName: 'deleteEquipmentArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_getAreaNeighbors: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"query","name":"areaId","dataType":"string"},
        };
        app.get('/area-neighbors',
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.getAreaNeighbors)),

            async function AreaNeighborController_getAreaNeighbors(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_getAreaNeighbors, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'getAreaNeighbors',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_getAreaNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaNeighborId: {"in":"path","name":"areaNeighborId","required":true,"dataType":"string"},
        };
        app.get('/area-neighbors/:areaNeighborId',
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.getAreaNeighbor)),

            async function AreaNeighborController_getAreaNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_getAreaNeighbor, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'getAreaNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_createAreaNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_AreaNeighbor.areaId-or-neighborAreaId_"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.post('/area-neighbors',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.createAreaNeighbor)),

            async function AreaNeighborController_createAreaNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_createAreaNeighbor, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'createAreaNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_updateAreaNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaNeighborId: {"in":"path","name":"areaNeighborId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_AreaNeighbor.areaId-or-neighborAreaId__"},
                request: {"in":"request","name":"request","required":true,"dataType":"object"},
        };
        app.put('/area-neighbors/:areaNeighborId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.updateAreaNeighbor)),

            async function AreaNeighborController_updateAreaNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_updateAreaNeighbor, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'updateAreaNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_deleteAreaNeighbor: Record<string, TsoaRoute.ParameterSchema> = {
                areaNeighborId: {"in":"path","name":"areaNeighborId","required":true,"dataType":"string"},
        };
        app.delete('/area-neighbors/:areaNeighborId',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.deleteAreaNeighbor)),

            async function AreaNeighborController_deleteAreaNeighbor(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_deleteAreaNeighbor, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'deleteAreaNeighbor',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaNeighborController_getAreaNeighborHistory: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/area-neighbors/history/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController)),
            ...(fetchMiddlewares<RequestHandler>(AreaNeighborController.prototype.getAreaNeighborHistory)),

            async function AreaNeighborController_getAreaNeighborHistory(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaNeighborController_getAreaNeighborHistory, request, response });

                const controller = new AreaNeighborController();

              await templateService.apiHandler({
                methodName: 'getAreaNeighborHistory',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getAreas: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getAreas)),

            async function AreaController_getAreas(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getAreas, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getAreas',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_getArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.get('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.getArea)),

            async function AreaController_getArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_getArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'getArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_createArea: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Pick_Area.name-or-locationDescription-or-plantId_"},
        };
        app.post('/areas',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.createArea)),

            async function AreaController_createArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_createArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'createArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_updateArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"Partial_Pick_Area.name-or-locationDescription__"},
        };
        app.put('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.updateArea)),

            async function AreaController_updateArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_updateArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'updateArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAreaController_deleteArea: Record<string, TsoaRoute.ParameterSchema> = {
                areaId: {"in":"path","name":"areaId","required":true,"dataType":"string"},
        };
        app.delete('/areas/:areaId',
            ...(fetchMiddlewares<RequestHandler>(AreaController)),
            ...(fetchMiddlewares<RequestHandler>(AreaController.prototype.deleteArea)),

            async function AreaController_deleteArea(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAreaController_deleteArea, request, response });

                const controller = new AreaController();

              await templateService.apiHandler({
                methodName: 'deleteArea',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
