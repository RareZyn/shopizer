package com.salesmanager.core.business.modules.integration.payment.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.salesmanager.core.model.customer.Customer;
import com.salesmanager.core.model.merchant.MerchantStore;
import com.salesmanager.core.model.order.Order;
import com.salesmanager.core.model.payments.Payment;
import com.salesmanager.core.model.payments.PaymentType;
import com.salesmanager.core.model.payments.Transaction;
import com.salesmanager.core.model.payments.TransactionType;
import com.salesmanager.core.model.shoppingcart.ShoppingCartItem;
import com.salesmanager.core.model.system.IntegrationConfiguration;
import com.salesmanager.core.model.system.IntegrationModule;
import com.salesmanager.core.modules.integration.IntegrationException;
import com.salesmanager.core.modules.integration.payment.model.PaymentModule;

/**
 * Free payment module for testing and learning purposes.
 * Does not process any real payments, just creates a successful transaction.
 * Bean is defined in shopizer-core-modules.xml
 */
public class FreePaymentModule implements PaymentModule {

	@Override
	public void validateModuleConfiguration(
			IntegrationConfiguration integrationConfiguration,
			MerchantStore store) throws IntegrationException {
		// No validation needed for free payment
	}

	@Override
	public Transaction initTransaction(MerchantStore store, Customer customer,
			BigDecimal amount, Payment payment,
			IntegrationConfiguration configuration, IntegrationModule module)
			throws IntegrationException {
		return createSuccessfulTransaction(amount);
	}

	@Override
	public Transaction authorize(MerchantStore store, Customer customer,
			List<ShoppingCartItem> items, BigDecimal amount, Payment payment,
			IntegrationConfiguration configuration, IntegrationModule module)
			throws IntegrationException {
		return createSuccessfulTransaction(amount);
	}

	@Override
	public Transaction authorizeAndCapture(MerchantStore store, Customer customer,
			List<ShoppingCartItem> items, BigDecimal amount, Payment payment,
			IntegrationConfiguration configuration, IntegrationModule module)
			throws IntegrationException {
		return createSuccessfulTransaction(amount);
	}

	@Override
	public Transaction refund(boolean partial, MerchantStore store, Transaction transaction,
			Order order, BigDecimal amount,
			IntegrationConfiguration configuration, IntegrationModule module)
			throws IntegrationException {
		Transaction refundTransaction = new Transaction();
		refundTransaction.setAmount(amount);
		refundTransaction.setTransactionDate(new Date());
		refundTransaction.setTransactionType(TransactionType.REFUND);
		refundTransaction.setPaymentType(PaymentType.COD);
		return refundTransaction;
	}

	@Override
	public Transaction capture(MerchantStore store, Customer customer,
			Order order, Transaction capturableTransaction,
			IntegrationConfiguration configuration, IntegrationModule module)
			throws IntegrationException {
		return createSuccessfulTransaction(capturableTransaction.getAmount());
	}

	private Transaction createSuccessfulTransaction(BigDecimal amount) {
		Transaction transaction = new Transaction();
		transaction.setAmount(amount);
		transaction.setTransactionDate(new Date());
		transaction.setTransactionType(TransactionType.AUTHORIZECAPTURE);
		transaction.setPaymentType(PaymentType.COD);
		return transaction;
	}
}
