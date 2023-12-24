public with sharing class SingleReallocationService {

    @AuraEnabled(cacheable=true)
    public static List<Country__c> getCountries() {
        return [SELECT Id, Name FROM Country__c ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getStores(List<String> countryList) {
        return [SELECT Main_boutique__r.Name, Main_boutique__r.Country__c, Main_boutique__c
                FROM Account 
                WHERE Main_boutique__c != null AND Main_boutique__r.Country__c IN :countryList
                GROUP BY Main_boutique__c, Main_boutique__r.Name, Main_boutique__r.Country__c
                ORDER BY Main_boutique__r.Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getOwners(List<String> storesList) {
        return [SELECT Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName, COUNT(Id) accountCount 
                FROM Account 
                WHERE Main_boutique__c IN :storesList  
                GROUP BY Main_boutique__c, OwnerId, Owner.LastName, Owner.FirstName];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(List<String> listOwners) {
        return [SELECT Name, Segment__c, OwnerId, Owner.LastName, Owner.FirstName, Main_boutique__r.Name , Main_boutique__c 
                FROM Account
                WHERE OwnerId IN :listOwners];
    }
}