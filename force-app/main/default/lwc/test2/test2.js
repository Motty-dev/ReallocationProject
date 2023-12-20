import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';

export default class SingleReallocation extends LightningElement {

    @track yourOptions = [];
    //     { Name: 'Option 1', Id: '1' },
    //     { Name: 'Option 2', Id: '2' },
    //     { Name: 'Option 3', Id: '3' },
    //     { Name: 'Option 4', Id: '4' },
    //     { Name: 'Option 5', Id: '5' },
    //     // Add more options as needed
    // ];

    handleSelectionChange(event) {
        // Handle the selection change logic
        const selectedValues = event.detail.selectedValues;
        console.log('Selected values:', selectedValues);
    }


    @track countries;
    @track stores;
    @track owners;
    @track selectedCountry;
    @track selectedStore;
    @track selectedOwner;
    @track isCountryDisabled = false;
    @track isOwnerDisabled = true;
    @track isStoreDisabled = true;
    
    


    

    handleSelectionChange(event) {
        // Handle the selection change
        console.log('Selected values:', event.detail.values);
        
    }

    onChangeCheckboxCountry(event) {
        this.yourOptions[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllCountries() {
        this.yourOptions.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }

    handleDeselectAllCountries() {
        this.yourOptions.forEach(item => item.isChecked = false);
    }

    handleSearchCountry(event) {
        this.yourOptions.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }
    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            console.log('1',data);
            this.yourOptions = data.map(country => ({ Name: country.Name, Id: country.Id, isChecked: false, display: true }));
            console.log('2',JSON.parse(JSON.stringify(this.yourOptions)));
            this.yourOptions.forEach(item => console.log(item));
        } else if (error) {
            // Handle error
        }
        
    }

    handleCountryChange(event) {
        this.selectedCountry = event.detail.value;
        this.isStoreDisabled = false;
        this.stores = []; // Clear stores when country changes
        this.owners = []; // Clear owners when country changes
        // Fetch stores based on the selected country
        getStores({ countryList: [this.selectedCountry] })
            .then(result => {
                // Process result to create options for stores combobox
            })
            .catch(error => {
                // Handle error
            });
    }

    handleStoreChange(event) {
        this.selectedStore = event.detail.value;
        this.isOwnerDisabled = false;
        // Fetch owners based on the selected store
        getOwners({ storesList: [this.selectedStore] })
            .then(result => {
                // Process result to create options for owners combobox
            })
            .catch(error => {
                // Handle error
            });
    }

    handleOwnerChange(event) {
        this.selectedOwner = event.detail.value;
        // You can now have logic to fetch or process accounts based on the selected owner
    }

    handleSearch() {
        // Logic to handle search when "Search Clients" button is clicked
    }
}

// import { LightningElement, track, wire } from 'lwc';
// import getCountries from '@salesforce/apex/CountryService.getCountries';
// import getStores from '@salesforce/apex/StoreService.getStores';
// import getOwners from '@salesforce/apex/UserService.getOwners';
// import getAccounts from '@salesforce/apex/AccountService.getAccounts';

// export default class Test2 extends LightningElement {
//     @track countries = [];
//     @track stores = [];
//     @track owners = [];
//     @track selectedCountry = '';
//     @track selectedStore = '';
//     @track selectedOwner = '';
//     @track isStoreDisabled = true;
//     @track isOwnerDisabled = true;

//     @wire(getCountries)
//     wiredCountries({ error, data }) {
//         if (data) {
//             this.countries = data.map(country => ({ label: country.Name, value: country.Id }));
//         } else if (error) {
//             // Handle error
//         }
//     }

//     handleCountryChange(event) {
//         this.selectedCountry = event.detail.value;
//         this.isStoreDisabled = false;
//         // Call getStores Apex method with selected country
//         getStores({ countryList: [this.selectedCountry] })
//             .then(result => {
//                 this.stores = result.map(store => ({ label: store.Main_boutique__r.Name, value: store.Main_boutique__c }));
//             })
//             .catch(error => {
//                 // Handle error
//             });
//     }

//     handleStoreChange(event) {
//         this.selectedStore = event.detail.value;
//         this.isOwnerDisabled = false;
//         // Call getOwners Apex method with selected store
//         getOwners({ storesList: [this.selectedStore] })
//             .then(result => {
//                 this.owners = result.map(owner => ({ label: owner.Owner.LastName, value: owner.OwnerId }));
//             })
//             .catch(error => {
//                 // Handle error
//             });
//     }

//     handleOwnerChange(event) {
//         this.selectedOwner = event.detail.value;
//         // Now you can enable the "Search Clients" button if needed
//     }

//     handleSearch() {
//         // Call getAccounts Apex method with selected owner
//         getAccounts({ ownerList: [this.selectedOwner] })
//             .then(result => {
//                 // Handle fetched accounts
//             })
//             .catch(error => {
//                 // Handle error
//             });
//     }
// }
