import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';

export default class SingleReallocation extends LightningElement {

    @track yourOptions = [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
        { label: 'Option 4', value: '4' },
        { label: 'Option 5', value: '5' },
        // Add more options as needed
    ];

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
    @track isStoreDisabled = true;
    @track isOwnerDisabled = true;
    @track countryOptions = [
        // Replace these with actual options you want to provide
        { label: 'Australia', value: 'AU' },
        { label: 'Canada', value: 'CA' },
        // Add more options as needed...
    ];

    handleSelectionChange(event) {
        // Handle the selection change
        console.log('Selected values:', event.detail.values);
    }
    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            this.countries = data.map(country => ({ label: country.Name, value: country.Id }));
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
