import { all, call, delay, put, take, takeLatest } from 'redux-saga/effects'
import { actionTypes, failure, loadDataSuccess, tickClock } from './actions'

function* runClockSaga() {
  yield take(actionTypes.START_CLOCK)
  while (true) {
    yield put(tickClock(false))
    yield delay(1000)
  }
}

export default rootSaga
