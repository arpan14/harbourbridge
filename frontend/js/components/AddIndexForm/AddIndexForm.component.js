// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Forms from "../../services/Forms.service.js";
import Actions from "../../services/Action.service.js";

class AddIndexForm extends HTMLElement {
  get tableName() {
    return this.getAttribute("tableName");
  }

  get tableIndex() {
    return this.getAttribute("tableIndex");
  }

  get data() {
    return JSON.parse(this.getAttribute("colData"));
  }

  connectedCallback() {
    this.render();
    document.getElementById("index-name").addEventListener("focusout", () => {
      Forms.validateInput(
        document.getElementById("index-name"),
        "index-name-error"
      );
    });

    Forms.formButtonHandler("create-index-form", "create-index-button");
    if (document.getElementById("createIndexModal")) {
      document
        .getElementById("createIndexModal")
        .querySelector("i")
        .addEventListener("click", () => {
          Actions.closeSecIndexModal();
        });
    }

    if (document.getElementById("create-index-button")) {
      document
        .getElementById("create-index-button")
        .addEventListener("click", () => {
          Actions.fetchIndexFormValues(
            this.tableIndex,
            this.tableName,
            document.getElementById("index-name").value,
            document.getElementById("unique-switch").checked
          );
        });
    }

    this.data.map((row, idx) => {
      document
        .getElementById("checkbox-" + row + "-" + idx)
        .addEventListener("click", () => {
          Actions.changeCheckBox(row, idx);
        });
    });
  }

  render() {
    this.innerHTML = `
    <form id="create-index-form">
        <div class="form-group sec-index-label">
            <label for="index-name" class="bmd-label-floating black-label">Enter
                secondary index name</label>
            <input type="text" class="form-control black-border" name="index-name" 
            id="index-name" autocomplete="off">
            <span class='form-error' id='index-name-error'></span>
        </div>
        <div id="newIndexColumnListDiv" class="column-list-container">
              ${this.data
                .map((row, idx) => {
                  return `
                <div class="new-index-column-list" id="indexColumnRow${idx}">
                    <span class="order-id invisible-badge" id="order${row}${idx}">1</span>
                    <span class="column-name">${row}</span>
                    <span class="bmd-form-group is-filled">
                        <div class="checkbox float-right" >
                            <label>
                                <input type="checkbox" value="" id="checkbox-${row}-${idx}">
                                <span class="checkbox-decorator"><span id="index-checkbox-${row}-${idx}" class="check black-border" ></span>
                                    <div class="ripple-container"></div>
                                </span>
                            </label>
                        </div>
                    </span>
                </div>`;
                })
                .join("")}  
        </div>
        <div class="unique-swith-container">
            <span class="unique-swith-label">Unique</span>
            <label class="switch">
                <input id="unique-switch" type="checkbox">
                <span class="slider round" id="slider-span"></span>
            </label>
        </div>
    </form>`;
  }

  constructor() {
    super();
  }
}

window.customElements.define("hb-add-index-form", AddIndexForm);
