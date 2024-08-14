

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        token: action.payload.token,
        error: null,
      };

    case LOG_OUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        error: null,
      };

    case USER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
