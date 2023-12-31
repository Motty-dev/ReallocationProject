import { LightningElement, wire, track } from 'lwc';
import getOwners from '@salesforce/apex/UserService.getOwners';
import getStores from '@salesforce/apex/StoreService.getStores';
import getCountries from '@salesforce/apex/CountryService.getCountries';
import getSellers from '@salesforce/apex/SingleReallocationService.getSellers';
import getAccounts from '@salesforce/apex/SingleReallocationService.getAccounts';
import getStoreNames from '@salesforce/apex/SingleReallocationService.getStoreNames';
import getCountryNames from '@salesforce/apex/SingleReallocationService.getCountryNames';
import reallocateClients2 from '@salesforce/apex/SingleReallocationService.reallocateClients2';

import { showToast } from 'c/errorHandler';

export default class SingleReallocation extends LightningElement {

    @track storesData = [];           
    @track ownersData = [];
    @track accountsData = []; 
    @track countriesData = []; 
    @track selectedUserIds = [];

    @track countryOptions = [];
    @track boutiqueOptions = [];

    @track selectedStores = []; 
    @track selectedOwners = []; 
    @track selectedAccounts = []; 
    @track selectedCountries = [];

    @track storesDataSaPanel = [];
    @track ownersDataSaPanel = [];
    @track originalOwnersData = [];
    @track countriesDataSaPanel = []; 
    

    @track selectedStoresSaPanel = [];
    @track selectedOwnersSaPanel = [];
    @track selectedCountriesSaPanel = []; 

    

    @track loadTable = false;
    @track isLoading = false;
    @track isModalOpen = false;
    @track buttonEnabled = true;
    @track reallocaInable = true;
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
    //TODO: dataMap = [this.storesData, this.ownersData, this.countriesData, this.selectedStoresSaPanel];
    // to make the functions more generic
    
    // Country Controllers =================================================================================>>>>

    @wire(getCountries)
    wiredCountries({ error, data }) {
        if (data) {
            this.countriesData = data.map(country => ({ Name: country.Name, Id: country.Id, isChecked: false, display: true }));
            this.countriesDataSaPanel = JSON.parse(JSON.stringify(this.countriesData));

        } else if (error) {
            this.dispatchEvent(showToast('Error', 'Failed to retrieve countries: ' + error.body.message, 'error'));
        }
    }

    handleClickApplyCountries(event) {
        this.selectedCountries = event.detail.selectedValues;
        this.inputEnabledSecond = true;
        console.log(JSON.stringify(this.selectedCountries));
        this.getCountryNamesHandler();
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
            this.dispatchEvent(showToast('Error', 'Failed to retrieve stores: ' + error.body.message, 'error'));
        }  
    }
    handleClickApplyStores(event) {
        this.selectedStores = event.detail.selectedValues;
        this.inputEnabledThird = true;
        this.getStoreNamesHandler();
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
            this.dispatchEvent(showToast('Error', 'Failed to retrieve owners: ' + error.body.message, 'error'));
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
                this.accountsData = data.map(customer => ({
                            Id: customer.Id, 
                            ownerFullName: customer.Owner.FirstName + ' ' + customer.Owner.LastName,
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
                this.dispatchEvent(showToast('Error', 'Failed to retrieve accounts: ' + error.body.message, 'error'));
                this.isLoading = false;
            });
        this.fetchAndSetFilterOptions();
    }

    // SaPanel controllers =================================================================================>>>>

    @wire(getStores, { countryList: '$selectedCountriesSaPanel'})
    wiredStoresSaPanel({ error, data }) {
        if (data) {
            this.storesDataSaPanel = data.map(store => ({ Name: store.Name, Id: store.Main_boutique__c, isChecked: false, display: true }));
        } else if (error) {
            this.dispatchEvent(showToast('Error', 'Failed to retrieve stores: ' + error.body.message, 'error'));
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
            this.originalOwnersData = [...this.ownersDataSaPanel];

            console.log('TEST ', JSON.stringify(this.ownersDataSaPanel));
        } else if (error) {
            this.dispatchEvent(showToast('Error', 'Failed to retrieve sellers: ' + error.body.message, 'error'));
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

    handleOwnerSelected(event) {
        const ownerDetails = event.detail;
        this.selectedOwnersSaPanel = ownerDetails; 
        console.log('ownerDetails: ' + JSON.stringify(this.selectedOwnersSaPanel));
        this.reallocaInable = false;
    }

    handleSearchOwnersSaPanel(event) {
        const searchTerm = event.target.value.toLowerCase();
    
        if (searchTerm) {
            this.ownersDataSaPanel = this.originalOwnersData.filter(owner => 
                owner.OwnerName.toLowerCase().includes(searchTerm) || 
                owner.StoreName.toLowerCase().includes(searchTerm)
            );
        } else {
            this.ownersDataSaPanel = [...this.originalOwnersData];
        }
    }

    handleClickSaPanel(event){
        
    }

    // Table controllers =================================================================================>>>>

    get selectedText() {
        const totalClients = this.accountsData ? this.accountsData.length : 0;
        const selectedCount = this.selectedUserIds ? this.selectedUserIds.length : 0;
        return `${selectedCount} of ${totalClients} Clients selected`;
    }

    handleRowSelection(event) {
        this.selectedUserIds = event.detail;
        console.log(JSON.stringify(this.selectedUserIds));
    }

    getCountryNamesHandler() {
        getCountryNames({ countryIds: this.selectedCountries })
            .then(result => {
                this.countryOptions = [{ label: 'None', value: '' }];
                this.countryOptions.push(...result.map(name => ({ label: name, value: name })));
            })
            .catch(error => {
                this.dispatchEvent(showToast('Error', 'Failed to fetch country names: ' + error.body.message, 'error'));

            });
    }

    getStoreNamesHandler() {
        getStoreNames({ storeIds: this.selectedStores })
            .then(result => {
                this.boutiqueOptions = [{ label: 'None', value: '' }];
                this.boutiqueOptions.push(...result.map(name => ({ label: name, value: name })));
            })
            .catch(error => {
                this.dispatchEvent(showToast('Error', 'Failed to fetch store names: ' + error.body.message, 'error'));
            });
    }

    // PopUp Model controllers =================================================================================>>>>

    get modelOepn(){
        return this.isModalOpen;
    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModalHandler(event) {
        this.isModalOpen = false;
    }
    reallocateclients() {
        this.isModalOpen = false;
    }

    updateCustomersHndler() {
        console.log('Calling Apex with:',JSON.stringify(this.selectedUserIds.map(id => id)),JSON.stringify(this.selectedOwnersSaPanel.ownerId) ,JSON.stringify(this.selectedOwnersSaPanel.storeId));
        reallocateClients2({ customerIds: this.selectedUserIds, newOwnerId: this.selectedOwnersSaPanel.ownerId, newStoreId: this.selectedOwnersSaPanel.storeId })
            .then(() => {
                console.log('Customers updated successfully');
                this.dispatchEvent(showToast('Success !', 'Customers updated successfully ', 'success'));
            })
            .catch(error => {
                this.dispatchEvent(showToast('Error', 'Failed to update customers: ' + error.body.message, 'error'));
            });
            this.isModalOpen = false;
    }
}