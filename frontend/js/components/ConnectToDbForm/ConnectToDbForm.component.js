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

class ConnectToDbForm extends HTMLElement {

    connectedCallback() {
        this.render();
        let response;
        if (document.getElementById("connectToDbModal")) {
            document.getElementById("connectToDbModal")
                .querySelector("i")
                .addEventListener("click", () => {
                    Forms.resetConnectToDbModal();
                });
        }
        document.getElementById("db-type").addEventListener("change", () => {
            Forms.toggleDbType();
        });
        document.querySelectorAll("input").forEach(elem => {
            if (elem.type != "submit") {
                elem.addEventListener("focusout", () => {
                    Forms.validateInput(elem, elem.id + "-error");
                });
            }
        });
        Forms.formButtonHandler("connect-form", "connect-button");
        document.getElementById("connect-button")?.addEventListener("click", async () => {
            response = await Actions.onconnect(document.getElementById('db-type').value, document.getElementById('db-host').value,
                document.getElementById('db-port').value, document.getElementById('db-user').value,
                document.getElementById('db-name').value, document.getElementById('db-password').value);
            if (response.ok) {
                jQuery('#convert-button')?.off('click');
                document.getElementById("convert-button")?.addEventListener("click", this.convertSchema);
            }
            Forms.resetConnectToDbModal();
        });
    }

    convertSchema = async () => {
        Actions.showSpinner()
        await Actions.showSchemaAssessment();
        await Actions.ddlSummaryAndConversionApiCall();
        await Actions.setGlobalDataTypeList();
        window.location.href = '#/schema-report';
        Actions.sessionRetrieval(Actions.getSourceDbName());
        document.getElementById("convert-button").removeEventListener('click', this.convertSchema);
    }

    render() {
        this.innerHTML = `
            <div class="form-group">
                <label for="db-type">Database Type</label>
                <select class="form-control db-select-input" id="db-type" name="db-type">
                    <option value="" class="template"></option>
                    <option value="mysql">MySQL</option>
                    <option value="postgres">Postgres</option>
                    <option value="sqlserver">SQL Server</option>
                    <option value="oracle">Oracle</option>
                </select>
            </div>
            <div id="sql-fields" class="template">
                <form id="connect-form">
                    <div>
                        <label for="db-host">Database Host</label>
                        <input type="text" class="form-control db-input" name="db-host" id="db-host" autocomplete="off" />
                        <span class='form-error' id='db-host-error'></span><br>
                    </div>
                    <div>
                        <label for="db-port">Database Port</label>
                        <input class="form-control db-input" type="text" name="db-port" id="db-port" autocomplete="off" />
                        <span class='form-error' id='db-port-error'></span><br>
                    </div>
                    <div>
                        <label for="db-user">Database User</label>
                        <input class="form-control db-input" type="text" name="db-user" id="db-user" autocomplete="off" />
                        <span class='form-error' id='db-user-error'></span><br>
                    </div>
                    <div>
                        <label for="db-name">Database Name</label>
                        <input class="form-control db-input" type="text" name="db-name" id="db-name" autocomplete="off" />
                        <span class='form-error' id='db-name-error'></span><br>
                    </div>
                    <div>
                        <label for="db-password">Database Password</label>
                        <input class="form-control db-input" type="password" name="db-password" id="db-password"
                            autocomplete="off" />
                        <span class='form-error' id='db-password-error'></span><br>
                    </div>
                </form>
            </div>
        `;
    }

    constructor() {
        super();
    }
}

window.customElements.define('hb-connect-to-db-form', ConnectToDbForm);