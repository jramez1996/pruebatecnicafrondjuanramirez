const initialState = {
  loaderSpiner:false
};

const reducer = (state = initialState, action) => {
  
  switch (action.type) {
    case "LOADERSPINER":
    {
      let exportData={
        ...state,
        loaderSpiner: action.loaderSpiner
      };
      return exportData;
    }
    default:
      return state;
  }
};

export default reducer;