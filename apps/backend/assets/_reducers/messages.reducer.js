import { messageConstants } from "../_constants";

export function messages(state = {}, action) {
  switch (action.type) {
    case messageConstants.GETALL_REQUEST:
      return {
        loading: true,
        items: action.messages.items || [],
      };
    case messageConstants.GETALL_SUCCESS:
      return {
        loading: false,
        items: action.messages,
      };
    case messageConstants.GETALL_FAILURE:
      return {
        loading: false,
        items: [],
        error: action.error,
      };
    case messageConstants.CREATE_REQUEST:
      return { creating: true };
    case messageConstants.CREATE_SUCCESS:
      return {};
    case messageConstants.CREATE_FAILURE:
      return {};
    default:
      return state;
  }
}
