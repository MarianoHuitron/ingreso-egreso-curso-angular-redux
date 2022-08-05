import { createAction, props } from "@ngrx/store";
import { User } from "../models/user.model";


// setUser action
export const setUser = createAction(
    '[Auth] setUser',
    props<{user: User}>()
);

// unSetUser action
export const unSetUser = createAction('[Auth] unSetUser')