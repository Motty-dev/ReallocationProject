import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';
import getAccounts from '@salesforce/apex/SingleReallocationService.getAccounts';

export default class SingleReallocation extends LightningElement {
  
    @track storesData = [];           
    @track ownersData = [];
    @track countriesData = []; 
    @track accountsData = []; 
    @track selectedStores = [];      
    @track selectedOwners = []; 
    @track selectedAccounts = [];
    @track selectedCountries = [];
    
    @track inputEnabledFirst = true;
    @track inputEnabledSecond = false;
    @track inputEnabledThird = false;
    @track buttonEnabled = true;
    
    // Country Controllers =================================================================================>>>>

    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            this.countriesData = data.map(country => ({ Name: country.Name, Id: country.Id, isChecked: false, display: true }));
        } else if (error) {
            // Handle error
        }
    }

    handleClickApplyCountries(event) {
        this.selectedCountries = event.detail.selectedValues;
        this.inputEnabledSecond = true;
    }

    changeCheckboxCountries(event) {
        this.countriesData[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllCountries() {
        this.countriesData.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }

    handleDeselectAllCountries() {
        this.countriesData.forEach(item => {
            if(item.display) {
                item.isChecked = false;
            }
        });
    }

    handleSearchCountry(event) {
        this.countriesData.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }

    // Stores Controllers =================================================================================>>>>

    @wire(getStores, { countryList: '$selectedCountries'})
    wiredStores({ error, data }) {
        if (data) {
            this.storesData = data.map(store => ({ Name: store.Name, Id: store.Main_boutique__c, isChecked: false, display: true }));
        } else if (error) {
            console.error(error);
        }
        
    }
    handleClickApplyStores(event) {
        this.selectedStores = event.detail.selectedValues;
        this.inputEnabledThird = true;
    }

    changeCheckboxStore(event) {
        this.storesData[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllStores() {
        this.storesData.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }
    handleDeselectAllStores() {
        this.storesData.forEach(item => item.isChecked = false);
    }

    handleSearchStore(event) {
        this.storesData.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }


    // Owners Controllers =================================================================================>>>>

    @wire(getOwners, { storesList: '$selectedStores'})
    wiredOwners({ error, data }) {
        if (data) {
            this.ownersData = data.map(owner => ({ Name: owner.FirstName + " " + owner.LastName + " (" + owner.accountCount + ")", Id: owner.OwnerId, isChecked: false, display: true }));
        } else if (error) {
            // Handle error
        }
        
    }
    handleClickApplyOwners(event) {
        this.selectedOwners = event.detail.selectedValues;
        this.buttonEnabled = false;
        
    }

    changeCheckboxOwner(event) {
        this.ownersData[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllOwners() {
        this.ownersData.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }
    handleDeselectAllOwners() {
        this.ownersData.forEach(item => {
            if(item.display) {
                item.isChecked = false;
            }
        });
    }

    handleSearchOwner(event) {
        this.ownersData.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }

    // Customers Controllers =================================================================================>>>>

    handleButtonClick(event) {
        getAccounts({ listOwners: this.selectedOwners })
            .then(result => {
                this.accountsData = result;
                console.log(JSON.stringify(this.accountsData)); // Display data in console
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}