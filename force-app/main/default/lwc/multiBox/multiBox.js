import { LightningElement, track, api, wire } from 'lwc';
export default class MultiBox extends LightningElement {

    // API Variables
    @api picklistInput = ["Sales Cloud", "Service Cloud", "Marketing Cloud", "Commerce Cloud", "App Cloud", "Einstein Analytics", "Community Cloud", "IOTCloud", "Force.com", "Salesforce For Fresher", "Salesforce"];
    @api selectedItems = [];

    // Track Variables
    @track allValues = []; // this will store end result or selected values from picklist
    @track selectedObject = false;
    @track valuesVal = undefined;
    @track searchTerm = '';
    @track showDropdown = false;
    @track itemcounts = 'None Selected';
    @track selectionlimit = 10;
    @track showselectall = false;
    @track errors;
    //this function is used to show the dropdown list
    get filteredResults() {
        //copying data from parent component to local variables
        if (this.valuesVal == undefined) {
            this.valuesVal = this.picklistInput;
            //below method is used to change the input which we received from parent component
            //we need input in array form, but if it's coming in JSON Object format, then we can use below piece of code to convert object to array
            Object.keys(this.valuesVal).map(profile => {
                this.allValues.push({ Id: profile, Name: this.valuesVal[profile] });
            })

            this.valuesVal = this.allValues.sort(function (a, b) { return a.Id - b.Id });
            this.allValues = [];

            console.log('da ', JSON.stringify(this.valuesVal));
        }

        if (this.valuesVal != null && this.valuesVal.length != 0) {
            if (this.valuesVal) {
                const selectedProfileNames = this.selectedItems.map(profile => profile.Name);
                console.log('selectedProfileNames ', JSON.stringify(selectedProfileNames));
                return this.valuesVal.map(profile => {

                    //below logic is used to show check mark (✓) in dropdown checklist
                    const isChecked = selectedProfileNames.includes(profile.Id);
                    return {
                        ...profile,
                        isChecked
                    };

                }).filter(profile =>
                    profile.Id.toLowerCase().includes(this.searchTerm.toLowerCase())
                ).slice(0, 20);
            } else {
                return [];
            }
        }
    }

    //this function is used to filter/search the dropdown list based on user input
    handleSearch(event) {
        this.searchTerm = event.target.value;
        this.showDropdown = true;
        this.mouse = false;
        this.focus = false;
        this.blurred = false;
        if (this.selectedItems.length != 0) {
            if (this.selectedItems.length >= this.selectionlimit) {
                this.showDropdown = false;
            }
        }
    }

    //this function is used when user check/uncheck/selects (✓) an item in dropdown picklist
    handleSelection(event) {
        const selectedProfileId = event.target.value;
        const isChecked = event.target.checked;

        //if part will run if selected item is less than selection limit
        //else part will run if selected item is equal or more than selection limit
        if (this.selectedItems.length < this.selectionlimit) {

            //below logic is used to show check mark (✓) in dropdown checklist
            if (isChecked) {
                const selectedProfile = this.valuesVal.find(profile => profile.Id === selectedProfileId);
                if (selectedProfile) {
                    this.selectedItems = [...this.selectedItems, selectedProfile];
                    this.allValues.push(selectedProfileId);
                }
            } else {
                this.selectedItems = this.selectedItems.filter(profile => profile.Id !== selectedProfileId);
                this.allValues.splice(this.allValues.indexOf(selectedProfileId), 1);
            }
        } else {

            //below logic is used to when user select/checks (✓) an item in dropdown picklist
            if (isChecked) {
                this.showDropdown = false;
                this.errormessage();
            }
            else {
                this.selectedItems = this.selectedItems.filter(profile => profile.Id !== selectedProfileId);
                this.allValues.splice(this.allValues.indexOf(selectedProfileId), 1);
                this.errormessage();
            }
        }
        this.itemcounts = this.selectedItems.length > 0 ? `${this.selectedItems.length} options selected` : 'None Selected';

        if (this.itemcounts == 'None Selected') {
            this.selectedObject = false;
        } else {
            this.selectedObject = true;
        }
    }

    //custom function used to close/open dropdown picklist
    clickhandler(event) {
        this.mouse = false;
        this.showDropdown = true;
        this.clickHandle = true;
        this.showselectall = true;
    }

    //custom function used to close/open dropdown picklist
    mousehandler(event) {
        this.mouse = true;
        this.dropdownclose();
    }

    //custom function used to close/open dropdown picklist
    blurhandler(event) {
        this.blurred = true;
        this.dropdownclose();
    }

    //custom function used to close/open dropdown picklist
    focuhandler(event) {
        this.focus = true;
    }

    //custom function used to close/open dropdown picklist
    dropdownclose() {
        if (this.mouse == true && this.blurred == true && this.focus == true) {
            this.searchTerm = '';
            this.showDropdown = false;
            this.clickHandle = false;
        }
    }

    //this function is invoked when user deselect/remove (✓) items from dropdown picklist
    handleRemove(event) {
        const valueRemoved = event.target.name;
        this.selectedItems = this.selectedItems.filter(profile => profile.Id !== valueRemoved);
        this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);
        this.itemcounts = this.selectedItems.length > 0 ? `${this.selectedItems.length} options selected` : 'None Selected';
        this.errormessage();

        if (this.itemcounts == 'None Selected') {
            this.selectedObject = false;
        } else {
            this.selectedObject = true;
        }
    }

    //this function is used to deselect/uncheck (✓) all of the items in dropdown picklist
    handleclearall(event) {
        event.preventDefault();
        this.showDropdown = false;
        this.selectedItems = [];
        this.allValues = [];
        this.itemcounts = 'None Selected';
        this.searchTerm = '';
        this.selectionlimit = 10;
        this.errormessage();
        this.selectedObject = false;
    }

    //this function is used to select/check (✓) all of the items in dropdown picklist
    selectall(event) {
        event.preventDefault();

        if (this.valuesVal == undefined) {
            this.valuesVal = this.picklistinput;

            //below method is used to change the input which we received from parent component
            //we need input in array form, but if it's coming in JSON Object format, then we can use below piece of code to convert object to array
            Object.keys(this.valuesVal).map(profile => {
                this.allValues.push({ Id: profile, Name: this.valuesVal[profile] });
            })

            this.valuesVal = this.allValues.sort(function (a, b) { return a.Id - b.Id });
            this.allValues = [];
        }
        this.selectedItems = this.valuesVal;
        this.itemcounts = this.selectedItems.length + ' options selected';
        this.selectionlimit = this.selectedItems.length + 1;
        this.allValues = [];
        this.valuesVal.map((value) => {
            for (let property in value) {
                if (property == 'Id') {
                    this.allValues.push(`${value[property]}`);
                }
            }
        });
        console.log('value of this.allValues ', JSON.stringify(this.allValues));
        this.errormessage();
        this.selectedObject = true;
    }

    //this function is used to show the custom error message when user is trying to select picklist items more than selectionlimit passed by parent component  
    errormessage() {
        this.errors = {
            "Search Objects": "Maximum of " + this.selectionlimit + " items can be selected",
        };
        this.template.querySelectorAll("lightning-input").forEach(item => {
            let label = item.label;
            if (label == 'Search Objects') {

                // if selected items list crosses selection limit, it will through custom error
                if (this.selectedItems.length >= this.selectionlimit) {
                    item.setCustomValidity(this.errors[label]);
                } else {
                    //else part will clear the error
                    item.setCustomValidity("");
                }
                item.reportValidity();
            }
        });
    }
}