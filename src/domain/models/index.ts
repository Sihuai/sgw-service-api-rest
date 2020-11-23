import typeArango, { LogLevel } from 'type-arango'

const complete = typeArango({
    // fake user roles for the sake of simplicity
    getAuthorizedRoles(){ return ['admin'] },
    // verbose
	logLevel: LogLevel.Debug
});

export * from './users';

complete();