package com.salesmanager.core.business.services.payments;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.salesmanager.core.business.services.merchant.MerchantStoreService;
import com.salesmanager.core.model.merchant.MerchantStore;
import com.salesmanager.core.model.system.IntegrationConfiguration;

import javax.inject.Inject;

/**
 * Initializes default payment modules for the store on application startup.
 */
@Component
public class PaymentModuleInitializer {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaymentModuleInitializer.class);

    @Inject
    private PaymentService paymentService;

    @Inject
    private MerchantStoreService merchantStoreService;

    @EventListener(ApplicationReadyEvent.class)
    public void initializeDefaultPaymentModules() {
        try {
            LOGGER.info("Initializing default payment modules...");

            MerchantStore store = merchantStoreService.getByCode(MerchantStore.DEFAULT_STORE);
            if (store == null) {
                LOGGER.warn("DEFAULT store not found, skipping payment module initialization");
                return;
            }

            // Check if COD payment module is already configured
            Map<String, IntegrationConfiguration> configuredModules = paymentService.getPaymentModulesConfigured(store);

            if (configuredModules == null || !configuredModules.containsKey("cod")) {
                LOGGER.info("COD payment module not configured, adding default configuration");

                IntegrationConfiguration codConfig = new IntegrationConfiguration();
                codConfig.setModuleCode("cod");
                codConfig.setActive(true);
                codConfig.setDefaultSelected(false);
                codConfig.setEnvironment(IntegrationConfiguration.TEST_ENVIRONMENT);

                Map<String, String> keys = new HashMap<>();
                keys.put("transaction", "AUTHORIZECAPTURE");
                codConfig.setIntegrationKeys(keys);

                paymentService.savePaymentModuleConfiguration(codConfig, store);
                LOGGER.info("COD payment module configured successfully");
            } else {
                LOGGER.info("COD payment module already configured");
            }

            // Also configure money order for convenience
            if (configuredModules == null || !configuredModules.containsKey("moneyorder")) {
                LOGGER.info("Money Order payment module not configured, adding default configuration");

                IntegrationConfiguration moneyorderConfig = new IntegrationConfiguration();
                moneyorderConfig.setModuleCode("moneyorder");
                moneyorderConfig.setActive(true);
                moneyorderConfig.setDefaultSelected(false);
                moneyorderConfig.setEnvironment(IntegrationConfiguration.TEST_ENVIRONMENT);

                Map<String, String> keys = new HashMap<>();
                keys.put("transaction", "AUTHORIZECAPTURE");
                keys.put("address", "Cash on Delivery");
                moneyorderConfig.setIntegrationKeys(keys);

                paymentService.savePaymentModuleConfiguration(moneyorderConfig, store);
                LOGGER.info("Money Order payment module configured successfully");
            } else {
                LOGGER.info("Money Order payment module already configured");
            }

        } catch (Exception e) {
            LOGGER.error("Error initializing default payment modules", e);
        }
    }
}
