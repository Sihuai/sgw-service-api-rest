import typeArango, { LogLevel, config, RouteArg } from 'type-arango';

const complete = typeArango({
    logLevel: LogLevel.Warn,                                  // Available log levels are `Error`, `Warn`, `Info` & `Debug`
    requiredRolesFallback: ['user'],                          // when a route has no roles assigned, these roles will be required
    requiredWriterRolesFallback: ['admin'],                   // when a route has no writer roles assigned, these roles will be required
    providedRolesDefault: ['guest'],                          // clients will always have these roles, no mather if they're authenticated (also see getUserRoles)
    getUserRoles: function(req: Foxx.Request): string[] {
        return (req.session && req.session.data && req.session.data.roles || []).concat(config.providedRolesDefault);
    },                                                        // extracts the users `roles` from req.session.data.roles (this is the default config value)
    getAuthorizedRoles(userRoles: string[], accessRoles: string[]): string[] {
        return userRoles.filter((role: string) => accessRoles.includes(role));
    },                                                        // returns the user access roles that can be applied to the current route (this is the default config value)
    throwForbidden: 'unauthorized',                           // HTTP Status to return when an forbidden (invalid auth provided) request occurs
    throwUnauthorized: 'unauthorized',                        // HTTP Status to return when an unauthorized (no auth provided) request occurs
    unregisterAQLFunctionEntityGroup: true,                   // Whether to execute aqlfunctions.unregisterGroup for every collection Set to false when using custom AQL functions outside of type-arango
    dasherizeRoutes: true,                                    // Dasherize endpoints (eg `UserProfiles` becomes `user-profiles`)
    paramOperatorSeparator: '|',                              // Separator used to split a parameter value (ie /?x=LIKE|y)
    defaultLocale: 'en',                                      // When using Type.I18n the defaultLocale is used when other locales do not match
    defaultCurrency: 'USD',
    defaultListLimit: 25,
    defaultListLimitMax: 100,
    prefixCollectionName: false,                              // Prefix the collection name by applying `module.context.collectionName` to it
    exposeRouteFunctionsToSwagger: false,                     // Display the source of your routes in Swagger
    addAttributeWritersToReaders: true,
    stripDocumentId: true,                                    // Whether to strip the `_id` key from documents
    stripDocumentKey: false,                                  // Whether to strip the `_key` key from documents
    stripDocumentRev: true,                                   // Whether to strip the `_rev` key from documents
});

export * from './base.model';
export * from './bill.board';
export * from './card';
export * from './category';
export * from './media';
export * from './section';
export * from './token';
export * from './user';

complete();