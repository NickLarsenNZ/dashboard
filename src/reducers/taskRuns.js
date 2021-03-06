/*
Copyright 2019 The Tekton Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { combineReducers } from 'redux';
import keyBy from 'lodash.keyby';

function byId(state = {}, action) {
  switch (action.type) {
    case 'TASK_RUNS_FETCH_SUCCESS':
      return keyBy(action.data, 'metadata.uid');
    default:
      return state;
  }
}

function byNamespace(state = {}, action) {
  switch (action.type) {
    case 'TASK_RUNS_FETCH_SUCCESS':
      const taskRuns = {};
      action.data.forEach(taskRun => {
        const { name, uid } = taskRun.metadata;
        taskRuns[name] = uid;
      });

      const { namespace } = action;
      return {
        ...state,
        [namespace]: taskRuns
      };
    default:
      return state;
  }
}

function isFetching(state = false, action) {
  switch (action.type) {
    case 'TASK_RUNS_FETCH_REQUEST':
      return true;
    case 'TASK_RUNS_FETCH_SUCCESS':
    case 'TASK_RUNS_FETCH_FAILURE':
      return false;
    default:
      return state;
  }
}

function errorMessage(state = null, action) {
  switch (action.type) {
    case 'TASK_RUNS_FETCH_FAILURE':
      return action.error.message;
    case 'TASK_RUNS_FETCH_REQUEST':
    case 'TASK_RUNS_FETCH_SUCCESS':
      return null;
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  byNamespace,
  errorMessage,
  isFetching
});

export function getTaskRuns(state, namespace) {
  const taskRuns = state.byNamespace[namespace];
  return taskRuns ? Object.values(taskRuns).map(id => state.byId[id]) : [];
}

export function getTaskRun(state, name, namespace) {
  const taskRuns = state.byNamespace[namespace] || {};
  const taskRunId = taskRuns[name];
  return taskRunId ? state.byId[taskRunId] : null;
}

export function getTaskRunsErrorMessage(state) {
  return state.errorMessage;
}

export function isFetchingTaskRuns(state) {
  return state.isFetching;
}
