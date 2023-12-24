import { LightningElement, wire, track, api } from 'lwc';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getStores from '@salesforce/apex/StoreService.getStores';
import getOwners from '@salesforce/apex/UserService.getOwners';
import getAccounts from '@salesforce/apex/SingleReallocationService.getAccounts';

export default class SingleReallocation extends LightningElement {
    @api recordId;

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


    @track columns = [
        { label: 'Client Name', fieldName: 'clientName'},
        { label: 'Client ID', fieldName: 'Id'},
        { label: 'Segment', fieldName: 'Segment__c'},
        { label: 'Current Main Boutique', fieldName: 'boutiqueName'},
        { label: 'Current Main SA', fieldName: 'ownerFullName'}
    ];

    @track isLoading = false;
    limitSize = 50;
    offsetSize = 0;
    
    //TODO: dataMap = [this.storesData, this.ownersData, this.countriesData]; to make the functions more generic
    
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

        this.accountsData = [];
        this.offsetSize = 0;
        //this.loadMoreData(); when loadmore is ready
         
        getAccounts({ listOwners: this.selectedOwners })
            .then(data => {
                console.log(JSON.stringify(data));
                this.accountsData = data.map(customer => ({ Id: customer.Id, ownerFullName: customer.Owner.FirstName + ' ' + customer.Owner.LastName,
                            boutiqueName: customer.Main_boutique__r.Name,
                            clientName: customer.Name,
                            Segment__c: customer.Segment__c,
                            isChecked: false, display: true }));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    loadMoreData() {
        this.isLoading = true;
        apexMethod({listOwners: this.selectedOwners, limitSize: this.limitSize, offsetSize: this.offsetSize })
            .then(result => {
                this.data = [...this.data, ...result];
                this.offsetSize = this.data.length;
            })
            .catch(error => {
                console.error('Error:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleScroll(event) {
        const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
        if (bottom) {
            this.loadMoreData();
        }
    }
}