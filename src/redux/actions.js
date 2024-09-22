export const actionTypes = {
  LOADERSPINER: 'LOADERSPINER'
}
export function loaderSpiner(data) {
  return {
    type: actionTypes.LOADERSPINER,
    loaderSpiner:data.loaderSpiner,
  }
}