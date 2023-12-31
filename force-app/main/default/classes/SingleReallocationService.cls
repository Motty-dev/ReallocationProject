public with sharing class SingleReallocationService {

    @AuraEnabled(cacheable=true)
    public static List<Country__c> getCountries() {
        try {
            return [SELECT Id, Name FROM Country__c ORDER BY Name];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving countries: ' + e.getMessage());
        }
        
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getStores(List<String> countryList) {
        try {
            return [SELECT Main_boutique__r.Name, Main_boutique__r.Country__c, Main_boutique__c
                FROM Account 
                WHERE Main_boutique__c != null AND Main_boutique__r.Country__c IN :countryList
                GROUP BY Main_boutique__c, Main_boutique__r.Name, Main_boutique__r.Country__c
                ORDER BY Main_boutique__r.Name];  
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving stores: ' + e.getMessage());

        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOwners(List<String> storesList) {
        try {
            return [SELECT Main_boutique__r.Name, Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                FROM Account 
                WHERE Main_boutique__c IN :storesList  
                GROUP BY Main_boutique__c, Main_boutique__r.Name, OwnerId, Owner.LastName, Owner.FirstName];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving owners: ' + e.getMessage());

        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(List<String> listOwners) {
        try {
            return [SELECT Name, Segment__c, OwnerId, Owner.LastName, Owner.FirstName, Main_boutique__r.Name , Main_boutique__r.Country__r.Name,  Main_boutique__c 
                    FROM Account
                    WHERE OwnerId IN :listOwners];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving accounts: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getSellers(List<String> sellerList) {
        try {
            return [SELECT Main_boutique__r.Name, Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                    FROM Account 
                    WHERE Main_boutique__c IN :sellerList 
                    GROUP BY Main_boutique__c, Main_boutique__r.Name, OwnerId, Owner.LastName, Owner.FirstName];
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving sellers: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getCountryNames(List<Id> countryIds) {
        try {
            List<Country__c> countries = [SELECT Name FROM Country__c WHERE Id IN :countryIds];
        List<String> countryNames = new List<String>();
        for (Country__c country : countries) {
            countryNames.add(country.Name);
        }
        return countryNames;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving country names: ' + e.getMessage());

        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getStoreNames(List<Id> storeIds) {
        try {
            List<Store__c> stores = [SELECT Name FROM Store__c WHERE Id IN :storeIds];
        List<String> storeNames = new List<String>();
        for (Store__c store : stores) {
            storeNames.add(store.Name);
        }
        return storeNames;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving store names: ' + e.getMessage());

        }
        
    }

    @AuraEnabled
    public static void reallocateClients2(List<String> customerIds, Id newOwnerId, String newStoreId) {
        try {
            List<Account> customersToUpdate = [SELECT Name, Id, OwnerId, Main_boutique__c FROM Account WHERE Id IN :customerIds];

        for(String customerId : customerIds) {
            Account customer = new Account(Id = customerId, OwnerId = newOwnerId, Main_boutique__c = newStoreId);
            customersToUpdate.add(customer);
        }

        update customersToUpdate;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error reallocating clients: ' + e.getMessage());

        }
    }
}