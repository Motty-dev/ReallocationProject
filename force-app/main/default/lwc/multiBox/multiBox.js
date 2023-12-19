import { LightningElement, track, api } from 'lwc';
export default class MultiBox extends LightningElement {

    // API Variables
    @api componentId;              // Unique identifier for the component
    //@api options = [];             // Array of {Id ,Name, isChecked}
    @api disabled = false;         // Controlled by the parent component
    @api label;                    // Label for the combobox
    @api placeholder = 'Select an option';

    @track filteredResults = [];  // Filtered options based on search
    @track selectedItems = [];      // Selected item values
    @track displayedValue = '';     // Displayed text in the input field
    @track showDropdown = false; 
    @track selectedItemLabels = [];   // Flag to show/hide the dropdown

    @track mouse = false;
    @track blurred = false;
    @track focus = false;
    @track clickHandle = false;

    // @api
    // set options(value) {
    //     this._options = value;
    //     this.filteredResults = [...value]; // Initialize filtered result
    //     console.log('Received options:', this._options);
    // }
    // get options() {
    //     return this._options;
    // }

    @api options;


    get myOptions() {
        return this.options ? this.options : [];
    }


    get tempDisplayedValues() {
        const temp = this.myOptions.filter(item => item.isChecked).map(item => item.Name).join(', ');
        return temp.length ? temp : '';
    }

    get tempSelectedItems() {
        return this.myOptions.filter(item => item.isChecked).map(item => item.Id);
    }
    
    handleSearch(event) {
        console.log(event.target.value);
        // const searchTerm = event.target.value.toLowerCase();
        // this.filteredResults = this.options
        //     .filter(option => option.Name.toLowerCase().includes(searchTerm))
        //     .map(option => ({
        //         ...option,
        //         isChecked: this.selectedItems.includes(option.Id)
        //     }));

        this.dispatchEvent(new CustomEvent('searchcountry', {
            detail: {
                search: event.target.value
            }
        }))
    }

    handleSelection(event) {
        const selectedValue = event.target.value;
        const isSelected = event.target.checked;

        const index = event.target.dataset.index;
        console.log('index', index);
        console.log('checked', event.target.checked);
        console.log('value', event.target.value);

        this.dispatchEvent(new CustomEvent('changecountry', {
            detail: {
                index: index,
                checked: isSelected
            }
        }));
        // const { index } = event.target.dataset;
    
        // Update isChecked property of the options
        // this.options = this.options.map(option => 
        //     option.Id === selectedValue ? { ...option, isChecked: isSelected } : option
        // );

        // console.log('this.filteredResults[index].Name', JSON.stringify(this.filteredResults[index]));
        // this.filteredResults[index].isChecked = isSelected;
        // this.filteredResults = [...this.filteredResults];

        // let temp = [...this.filteredResults];
        // console.log('this.filteredResults[index].Name temp', JSON.stringify(temp[index]));
        // temp[index]["isChecked"] = isSelected;
        // this.filteredResults = temp;
        console.log('i am here')

        // this.filteredResults.forEach((item, key) => {
        //     if(key == index) {
        //         item.isChecked = isSelected;
        //     }
        // })
        
    
        // Update selectedItems based on isChecked
        // this.selectedItems = this.options.filter(option => option.isChecked).map(option => option.Id);
        // this.updateDisplayedValue();
    }
    
    
    

    // updateDisplayedValue() {
    //     this.displayedValue = this.selectedItems.length > 0
    //         ? this.selectedItems.map(selectedId => this.options.find(option => option.Id === selectedId)?.Name).join(', ')
    //         : this.placeholder;
    // }

    updateFilteredResults() {
        this.filteredResults = this.options.map(option => ({
            ...option,
            isChecked: this.selectedItems.includes(option.Id)
        }));
    }

    handleApply() {
        console.log('Selected Values:', this.selectedItems);
        this.dispatchEvent(new CustomEvent('selectionchange', {
            detail: { 
                componentId: this.componentId, 
                selectedValues: this.tempSelectedItems 
            }
        }));
        console.log("selectedItems:",JSON.stringify(this.selectedItems));
        console.log("tempSelectedItems:",JSON.stringify(this.tempSelectedItems));
    }

    selectAll() {
        console.log('select');

        this.dispatchEvent(new CustomEvent('selectallcountries'));
        // this.filteredResults.forEach(option => option.isChecked = true);
        // this.selectedItems = this.filteredResults.map(option => option.Id);
        // this.updateDisplayedValue();
    }

    deselectAll() {

        this.dispatchEvent(new CustomEvent('deselectallcountries'));
        // this.filteredResults.forEach(option => option.isChecked = false);
        // this.selectedItems = [];
        // this.updateDisplayedValue();
    }

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    closeDropdown() {
        this.showDropdown = false;
    }   
}





















    // clickhandler(event) {
    //     this.mouse = false;
    //     this.showDropdown = true;
    //     this.clickHandle = true;
    //     this.showselectall = true;
    // }

    // mousehandler(event) {
    //     this.mouse = true;
    //     this.dropdownClose();
    // }

    // blurhandler(event) {
    //     this.blurred = true;
    //     this.dropdownClose();
    // }

    // focuhandler(event) {
    //     this.focus = true;
    // }

    // dropdownClose() {
    //     if (this.mouse == true && this.blurred == true && this.focus == true) {
    //         this.searchTerm = '';
    //         this.showDropdown = false;
    //         this.clickHandle = false;
    //     }
    // }


    // get filteredResults() {
    //     //copying data from parent component to local variables
    //     if (this.valuesVal == undefined) {
    //         this.valuesVal = this.picklistInput;
    //         //below method is used to change the input which we received from parent component
    //         //we need input in array form, but if it's coming in JSON Object format, then we can use below piece of code to convert object to array
    //         Object.keys(this.valuesVal).map(profile => {
    //             this.allValues.push({ Id: profile, Name: this.valuesVal[profile] });
    //         })

    //         this.valuesVal = this.allValues.sort(function (a, b) { return a.Id - b.Id });
    //         this.allValues = [];

    //         console.log('da ', JSON.stringify(this.valuesVal));
    //     }

    //     if (this.valuesVal != null && this.valuesVal.length != 0) {
    //         if (this.valuesVal) {
    //             const selectedProfileNames = this.selectedItems.map(profile => profile.Name);
    //             console.log('selectedProfileNames ', JSON.stringify(selectedProfileNames));
    //             return this.valuesVal.map(profile => {

    //                 //below logic is used to show check mark (✓) in dropdown checklist
    //                 const isChecked = selectedProfileNames.includes(profile.Id);
    //                 return {
    //                     ...profile,
    //                     isChecked
    //                 };

    //             }).filter(profile =>
    //                 profile.Id.toLowerCase().includes(this.searchTerm.toLowerCase())
    //             ).slice(0, 20);
    //         } else {
    //             return [];
    //         }
    //     }
    // }

    //this function is used to filter/search the dropdown list based on user input

    
    // handleSelection(event) {
    //     const selectedProfileId = event.target.value;
    //     const isChecked = event.target.checked;
        
    //     // Find the profile and update its isChecked property
    //     this.valuesVal = this.valuesVal.map(profile => {
    //         if (profile.Id === selectedProfileId) {
    //             return { ...profile, isChecked };
    //         }
    //         return profile;
    //     });

        
    //     // Update selectedItems based on isChecked
    //     if (isChecked) {
    //         const selectedProfile = this.valuesVal.find(profile => profile.Id === selectedProfileId);
    //         this.selectedItems.push(selectedProfile);
    //     } else {
    //         this.selectedItems = this.selectedItems.filter(item => item.Id !== selectedProfileId);
    //     }
        
    //     // Update the displayed value
    //     this.displayedValue = this.selectedItems.map(item => item.Name).join(', ');
    
    //     // Force the component to update
    //     this.valuesVal = [...this.valuesVal];
    // }
    
    // handleSelection(event) {
    //     const selectedProfileId = event.target.value;
    //     const isChecked = event.target.checked;
        
    //     // Find the profile in valuesVal and update its isChecked property
    //     const profileIndex = this.valuesVal.findIndex(profile => profile.Id === selectedProfileId);
    //     if (profileIndex !== -1) {
    //         const profile = this.valuesVal[profileIndex];
    //         profile.isChecked = isChecked;
    //         if (isChecked && !this.selectedItems.includes(profile)) {
    //             this.selectedItems.push(profile);
    //         } else if (!isChecked) {
    //             this.selectedItems = this.selectedItems.filter(item => item.Id !== selectedProfileId);
    //         }
    //     }
        
    //     this.displayedValue = this.selectedItems.map(item => item.Name).join(', ');
    // }
    
    // handleSelection(event) {
    //     const selectedProfileId = event.target.value;
    //     const isChecked = event.target.checked;
    
    //     if (isChecked) {
    //         const selectedProfile = this.valuesVal.find(profile => profile.Id === selectedProfileId);
    //         if (selectedProfile) {
    //             this.selectedItems = [...this.selectedItems, selectedProfile];
    //         }
    //     } else {
    //         this.selectedItems = this.selectedItems.filter(profile => profile.Id !== selectedProfileId);
    //     }
    
    //     // Update the displayed value to be a list of selected item names
    //     this.displayedValue = this.selectedItems.map(item => item.Name).join(', ');
    
    //     // If there are no selected items, set displayedValue to 'None Selected'
    //     if (this.selectedItems.length === 0) {
    //         this.displayedValue = 'None Selected';
    //     }
    // }
    

    
    
    // selectall(event) {
    //     event.preventDefault();
    
    //     // Set all items to checked and update displayedValue
    //     this.selectedItems = [...this.picklistInput.map((name, index) => ({ Id: index.toString(), Name: name }))];
    //     this.displayedValue = this.selectedItems.map(item => item.Name).join(', ');
    
    //     // Update isChecked for all values
    //     this.valuesVal = this.picklistInput.map((name, index) => ({
    //         Id: index.toString(),
    //         Name: name,
    //         isChecked: true
    //     }));
    // }
    
    // handleclearall(event) {
    //     event.preventDefault();
    
    //     // Set all items to unchecked and clear displayedValue
    //     this.selectedItems = [];
    //     this.displayedValue = 'None Selected';
    
    //     // Update isChecked for all values
    //     this.valuesVal = this.picklistInput.map((name, index) => ({
    //         Id: index.toString(),
    //         Name: name,
    //         isChecked: false
    //     }));
    // }
    

    


    // selectall(event) {
    //     event.preventDefault();

    //     if (this.valuesVal == undefined) {
    //         this.valuesVal = this.picklistinput;

    //         //below method is used to change the input which we received from parent component
    //         //we need input in array form, but if it's coming in JSON Object format, then we can use below piece of code to convert object to array
    //         Object.keys(this.valuesVal).map(profile => {
    //             this.allValues.push({ Id: profile, Name: this.valuesVal[profile] });
    //         })

    //         this.valuesVal = this.allValues.sort(function (a, b) { return a.Id - b.Id });
    //         this.allValues = [];
    //     }
    //     this.selectedItems = [...this.valuesVal];
    //     this.displayedValue = this.selectedItems.map(item => item.Name).join(', ');
    //     this.valuesVal = this.valuesVal.map(item => ({
    //         ...item,
    //         isChecked: true
    //     }));
    
    //     this.itemcounts = this.selectedItems.length + ' options selected';
    //     this.selectionlimit = this.selectedItems.length + 1;
    //     this.allValues = [];
    //     this.valuesVal.map((value) => {
    //         for (let property in value) {
    //             if (property == 'Id') {
    //                 this.allValues.push(`${value[property]}`);
    //             }
    //         }
    //     });
    //     console.log('value of this.allValues ', JSON.stringify(this.allValues));
    //     this.errormessage();
    //     this.selectedObject = true;
    // }

    //this function is used to show the custom error message when user is trying to select picklist items more than selectionlimit passed by parent component  




//-----------------------------//

// handleSelection(event) {
//     const selectedProfileId = event.target.value;
//     const isChecked = event.target.checked;

//     //if part will run if selected item is less than selection limit
//     //else part will run if selected item is equal or more than selection limit
//     if (this.selectedItems.length < this.selectionlimit) {

//         //below logic is used to show check mark (✓) in dropdown checklist
//         if (isChecked) {
//             const selectedProfile = this.valuesVal.find(profile => profile.Id === selectedProfileId);
//             if (selectedProfile) {
//                 this.selectedItems = [...this.selectedItems, selectedProfile];
//                 this.allValues.push(selectedProfileId);
//             }
//         } else {
//             this.selectedItems = this.selectedItems.filter(profile => profile.Id !== selectedProfileId);
//             this.allValues.splice(this.allValues.indexOf(selectedProfileId), 1);
//         }
//     } else {

//         //below logic is used to when user select/checks (✓) an item in dropdown picklist
//         if (isChecked) {
//             this.showDropdown = false;
//             this.errormessage();
//         }
//         else {
//             this.selectedItems = this.selectedItems.filter(profile => profile.Id !== selectedProfileId);
//             this.allValues.splice(this.allValues.indexOf(selectedProfileId), 1);
//             this.errormessage();
//         }
//     }
//     this.itemcounts = this.selectedItems.length > 0 ? `${this.selectedItems.length} options selected` : 'None Selected';

//     if (this.itemcounts == 'None Selected') {
//         this.selectedObject = false;
//     } else {
//         this.selectedObject = true;
//     }
// }