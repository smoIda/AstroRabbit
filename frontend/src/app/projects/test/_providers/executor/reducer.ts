import { ActionExecutor, InitialExecutor } from "@/app/projects/test/_providers/executor/config";

export const initialExecutor: InitialExecutor = {
  id: null,
  status: "IDLE",
  error: null,
};

export const actionExecutor = (state: InitialExecutor, action: ActionExecutor): InitialExecutor => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        id: null,
        status: "IDLE",
      };

    case "SET_ID":
      return {
        ...state,
        id: action.payload,
      };

    case "SET_EXECUTOR":
      return {
        ...state,
        status: action.payload.status,
        error:
          action.payload.status === "ERROR"
            ? action.payload.error || "Internal execution error"
            : null,
      };

    default:
      return state;
  }
};
