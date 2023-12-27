import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';
import getAccounts from '@salesforce/apex/SingleReallocationService.getAccounts';
import getSellers from '@salesforce/apex/SingleReallocationService.getSellers';

export default class SingleReallocation extends LightningElement {

    @track storesData = [];           
    @track ownersData = [];
    @track accountsData = []; 
    @track countriesData = []; 

    @track selectedStores = []; 
    @track selectedOwners = []; 
    @track selectedAccounts = []; ///for ids from the table
    @track selectedCountries = [];

    @track storesDataSaPanel = [];
    @track ownersDataSaPanel = [];
    @track countriesDataSaPanel = []; 

    @track selectedStoresSaPanel = [];
    @track selectedOwnersSaPanel = [];
    @track selectedCountriesSaPanel = []; 
    
    @track loadTable = true;
    @track isLoading = false;
    @track buttonEnabled = true;
    @track inputEnabledFirst = true;
    @track inputEnabledThird = false;
    @track inputEnabledForth = false;
    @track inputEnabledSecond = false;
    

    @track columns = [
        { label: 'Client Name', fieldName: 'clientName'},
        { label: 'Client ID', fieldName: 'Id'},
        { label: 'Country', fieldName: 'Country'},
        { label: 'Segment', fieldName: 'Segment__c'},
        { label: 'Current Main Boutique', fieldName: 'boutiqueName'},
        { label: 'Current Main SA', fieldName: 'ownerFullName'}
    ];    
    //TODO: dataMap = [this.storesData, this.ownersData, this.countriesData, this.selectedStoresSaPanel]; to make the functions more generic
    
    // Country Controllers =================================================================================>>>>

    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            this.countriesData = data.map(country => ({ Name: country.Name, Id: country.Id, isChecked: false, display: true }));
            this.countriesDataSaPanel = JSON.parse(JSON.stringify(this.countriesData));

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

        this.isLoading = true;
        this.accountsData = [];
        
        getAccounts({ listOwners: this.selectedOwners })
            .then(data => {
                console.log(JSON.stringify(data));
                this.accountsData = data.map(customer => ({ Id: customer.Id, ownerFullName: customer.Owner.FirstName + ' ' + customer.Owner.LastName,
                            boutiqueName: customer.Main_boutique__r.Name,
                            clientName: customer.Name,
                            Segment__c: customer.Segment__c,
                            Country: customer.Main_boutique__r.Country__r.Name,
                            isChecked: false,
                            display: true 
                }));
                this.isLoading = false;
                this.loadTable = true;
                this.buttonEnabled = true;
            })
            .catch(error => {
                console.error('Error:', error);
                this.isLoading = false;
            });
    }

    // SaPanel controllers =================================================================================>>>>

    @wire(getStores, { countryList: '$selectedCountriesSaPanel'})
    wiredStoresSaPanel({ error, data }) {
        if (data) {
            this.storesDataSaPanel = data.map(store => ({ Name: store.Name, Id: store.Main_boutique__c, isChecked: false, display: true }));
        } else if (error) {
            console.error(error);
        }  
    }

    @wire(getSellers, { sellerList: '$selectedStoresSaPanel'})
    wiredOwnersSaPanel({ error, data }) {
        if (data) { 
            console.log('data 2 ', JSON.stringify(data));
            this.ownersDataSaPanel = data.map(owner => ({ 
                StoreName: owner.Name,
                StoreId: owner.Main_boutique__c,
                OwnerId: owner.OwnerId,
                OwnerName: owner.FirstName + ' ' + owner.LastName,
                AccountCount: owner.accountCount,
            }));

            console.log('TEST ', JSON.stringify(this.ownersDataSaPanel));
        } else if (error) {
            // console.log(error);
        }
    }
    handleClickApplyCountriesSaPanel(event) {
        this.selectedCountriesSaPanel = event.detail.selectedValues;
        this.inputEnabledForth = true;
    }

    changeCheckboxCountriesSaPanel(event) {
        this.countriesDataSaPanel[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllCountriesSaPanel() {
        this.countriesDataSaPanel.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }

    handleDeselectAllCountriesSaPanel() {
        this.countriesDataSaPanel.forEach(item => {
            if(item.display) {
                item.isChecked = false;
            }
        });
    }

    handleSearchCountrySaPanel(event) {
        this.countriesDataSaPanel.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }

    handleClickApplyStoresSaPanel(event) {
        this.selectedStoresSaPanel = event.detail.selectedValues;
    }

    changeCheckboxStoresSaPanel(event) {
        this.storesDataSaPanel[event.detail.index].isChecked = event.detail.checked;
    }

    handleSelectAllStoresSaPanel() {
        this.storesDataSaPanel.forEach(item => {
            if(item.display) {
                item.isChecked = true;
            }
        });
    }

    handleDeselectAllStoresSaPanel() {
        this.storesDataSaPanel.forEach(item => {
            if(item.display) {
                item.isChecked = false;
            }
        });
    }

    handleSearchStoreSaPanel(event) {
        this.storesDataSaPanel.forEach(item => {
            item.display = item.Name.toLowerCase().includes(event.detail.search.toLowerCase())
        });
    }

    handleClickSaPanel(event){

    }

}