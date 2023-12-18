public with sharing class StoreService {
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getStores(List<String> countryList) {
        return [SELECT Main_boutique__r.Name, Main_boutique__r.Country__c, Main_boutique__c
                FROM Account 
                WHERE Main_boutique__c != null AND Main_boutique__r.Country__c IN :countryList
                GROUP BY Main_boutique__c, Main_boutique__r.Name, Main_boutique__r.Country__c
                ORDER BY Main_boutique__r.Name];
    }
}