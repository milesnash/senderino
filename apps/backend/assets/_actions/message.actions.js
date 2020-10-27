import { messageConstants } from "../_constants";
import { messageService } from "../_services";
import { alertActions } from "./";

export const messageActions = {
  create,
  getAll,
};

function create(message) {
  return (dispatch) => {
    dispatch(request(message));

    messageService.create(message).then(
      () => {
        dispatch(success(message));
        dispatch(alertActions.success("Message sent"));
      },
      (error) => {
        dispatch(failure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    );
  };

  function request(message) {
    return { type: messageConstants.CREATE_REQUEST, message };
  }
  function success(message) {
    return { type: messageConstants.CREATE_SUCCESS, message };
  }
  function failure(error) {
    return { type: messageConstants.CREATE_FAILURE, error };
  }
}

function getAll(currentMessages = []) {
  return (dispatch) => {
    dispatch(request(currentMessages));

    messageService.getAll().then(
      (messages) => dispatch(success(messages)),
      (error) => dispatch(failure(error.toString()))
    );
  };

  function request(currentMessages) {
    return { type: messageConstants.GETALL_REQUEST, messages: currentMessages };
  }
  function success(messages) {
    return { type: messageConstants.GETALL_SUCCESS, messages };
  }
  function failure(error) {
    return { type: messageConstants.GETALL_FAILURE, error };
  }
}