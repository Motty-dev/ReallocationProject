import { LightningElement, track, api } from 'lwc';
export default class MultiBox2 extends LightningElement {

    // API Variables
    @api componentId;              // Unique identifier for the component
    @api options = [];             // Array of {label, value}
    @api disabled = false;         // Controlled by the parent component
    @api label;                    // Label for the combobox
    @api placeholder = 'Select an option';

    @track filteredResults = [];    // Filtered options based on search
    @track selectedItems = [];      // Selected item values
    @track displayedValue = '';     // Displayed text in the input field
    @track showDropdown = false;    // Flag to show/hide the dropdown

    @track mouse = false;
    @track blurred = false;
    @track focus = false;
    @track clickHandle = false;

    
    connectedCallback() {
        this.initializeOptions();
    }

    initializeOptions() {
        this.filteredResults = this.options.map((option, index) => ({
            Id: index.toString(), // Or another unique identifier
            Name: option.label,
            isChecked: this.selectedItems.includes(option.value)
        }));
        console.log('Selected Items:', this.selectedItems);

    }
    
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        this.filteredResults = this.options
            .filter(option => option.label.toLowerCase().includes(searchTerm))
            .map(option => ({
                ...option,
                isChecked: this.selectedItems.includes(option.value)
            }));
    }

    handleSelection(event) {
        const selectedValue = event.target.value;
        const isSelected = event.target.checked;

        // Update isChecked property of the profile
        this.filteredResults = this.filteredResults.map(option => {
            if (option.Id === selectedValue) {
                option.isChecked = isSelected;
            }
            return option;
        });

        // Update selectedItems based on isChecked
        this.selectedItems = this.filteredResults.filter(option => option.isChecked).map(option => option.Id);
        this.updateDisplayedValue();
        console.log('Selected Items:', this.selectedItems);
    }
    

    updateDisplayedValue() {
        this.displayedValue = this.selectedItems.length > 0
            ? this.selectedItems.map(value => this.options.find(option => option.value === value)?.label).join(', ')
            : this.placeholder;

        console.log('Selected Items:', this.selectedItems);

    }

    updateFilteredResults() {
        this.filteredResults = this.options.map(option => ({
            ...option,
            isChecked: this.selectedItems.includes(option.value)
        }));
    }

    handleApply() {
        this.dispatchEvent(new CustomEvent('selectionchange', {
            detail: { 
                componentId: this.componentId, 
                selectedValues: this.selectedItems 
            }
        }));
    }

    selectAll() {
        this.filteredResults.forEach(option => option.isChecked = true);
        this.selectedItems = this.filteredResults.map(option => option.Id);
        this.updateDisplayedValue();
    }

    deselectAll() {
        this.filteredResults.forEach(option => option.isChecked = false);
        this.selectedItems = [];
        this.updateDisplayedValue();
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