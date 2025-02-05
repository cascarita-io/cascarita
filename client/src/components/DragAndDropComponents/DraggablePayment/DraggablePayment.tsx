import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Draggable } from "react-beautiful-dnd";
import { StripeAccount } from "./types";
import styles from "./DraggablePayment.module.css";
import DraggableSubMenu from "../DraggableSubMenu/DraggableSubMenu";
import Switch from "react-switch";
import { useTranslation } from "react-i18next";
import { SMALL_DRAGGABLE_CONTAINER_WIDTH } from "../constants";
import { formatPayment } from "../../../utils/formatPayment";
import { getStripeAccounts } from "../../../api/stripe/service";
import nullthrows from "nullthrows";
import { useAuth0 } from "@auth0/auth0-react";
import { DraggableProps } from "../types";
import { useQuery } from "@tanstack/react-query";

const DraggablePayment: React.FC<DraggableProps> = ({
  index,
  formField,
  onDelete,
  onCopy,
}) => {
  const { user } = useAuth0();
  const { t } = useTranslation("DraggableFields");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContainerWidthMaxed, setIsContainerWidthMaxed] = useState(false);
  const [paymentFee, setPaymentFee] = useState(
    formField.properties?.price?.feeValue ?? ""
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const { setValue, control } = useFormContext();

  const calculateStripeFee = (price: number): number => {
    const feePercentage = 0.029;
    const fixedFee = 0.3;
    const fee = price * feePercentage + fixedFee;
    return Math.ceil(fee * 100) / 100;
  };

  // TODO: Make a DB call to get our user related with Auth0 user id
  //const groupId = nullthrows(user?.group_id, "User does not have a group ID");
  const groupId = 1;
  const { data: stripeAccounts = [], isLoading } = useQuery({
    queryKey: ["stripeAccounts", groupId],
    queryFn: () => getStripeAccounts(groupId),
  });

  useEffect(() => {
    if (stripeAccounts.length > 0) {
      console.log("here is the stripe id : " + stripeAccounts[0].id);
      console.log(
        "here is the stripe account id : " + stripeAccounts[0].stripe_account_id
      );
    }

    if (
      stripeAccounts.length > 0 &&
      formField.properties?.stripe_account &&
      formField.properties.stripe_account.id === ""
    ) {
      setValue(`fields.${index}.properties.stripe_account`, {
        id: stripeAccounts[0].id,
        stripe_account_id: stripeAccounts[0].stripe_account_id,
      });
    }
  }, [stripeAccounts, formField.properties?.stripe_account, setValue, index]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setIsContainerWidthMaxed(
          containerRef.current.offsetWidth < SMALL_DRAGGABLE_CONTAINER_WIDTH
        );
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const displayStripeAccountOptions = () => {
    return stripeAccounts.map((account: StripeAccount) => (
      <option
        key={account.id}
        value={JSON.stringify({
          id: account.id,
          stripe_account_id: account.stripe_account_id,
        })}
      >
        {account.first_name}&apos;s Account
      </option>
    ));
  };

  return (
    <Draggable draggableId={formField.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          onClick={handleClick}
        >
          <div style={{ position: "relative" }} ref={containerRef}>
            <p className={styles.textElementTypeText}>{t("payment")}</p>
            <div className={styles.draggableContainer}>
              <Controller
                key={index}
                name={`fields.${index}.title`}
                control={control}
                defaultValue={formField.title} // Ensure the default value is set
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={t("title")}
                    className={styles.question}
                  />
                )}
              />
              {formField.properties?.description != null && (
                <Controller
                  name={`fields.${index}.properties.description`}
                  control={control}
                  defaultValue={formField.properties?.description}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder={t("description")}
                      className={styles.question}
                    />
                  )}
                />
              )}
              <hr />
              {formField.properties?.price != null && (
                <div className={styles.paymentGroup}>
                  <div className={styles.payment}>
                    <p className={styles.paymentText}>{t("paymentAmount")}: </p>
                    <div className={styles.paymentInputGroup}>
                      <p className={styles.currencySymbol}>$</p>
                      <Controller
                        key={index}
                        name={`fields.${index}.properties.price.value`}
                        control={control}
                        defaultValue={formField.properties.price.value}
                        render={({ field }) => (
                          <input
                            {...field}
                            value={formatPayment(field.value)}
                            onChange={(e) => {
                              const newFee = formatPayment(
                                calculateStripeFee(+e.target.value).toString()
                              );
                              setPaymentFee(newFee);
                              setValue(
                                `fields.${index}.properties.price.feeValue`,
                                newFee
                              );
                              field.onChange(e.target.value);
                            }}
                            placeholder={"0.00"}
                            className={styles.paymentInput}
                          />
                        )}
                      />
                    </div>
                    <p className={styles.currency}>
                      {formField.properties.price?.currency}
                    </p>
                  </div>
                  <div className={styles.payment}>
                    <p className={styles.paymentText}>{t("feeAmount")}: </p>
                    <div className={styles.paymentInputGroup}>
                      <p className={styles.currencySymbol}>$</p>
                      <div className={styles.paymentDisplay}>
                        <Controller
                          name={`fields.${index}.properties.price.feeValue`}
                          control={control}
                          defaultValue={formField.properties.price.feeValue}
                          render={({ field }) => (
                            <input
                              {...field}
                              value={paymentFee}
                              placeholder={"0.00"}
                              className={styles.paymentInput}
                              readOnly
                            />
                          )}
                        />
                      </div>
                    </div>
                    <p className={styles.currency}>
                      {formField.properties.price?.currency}
                    </p>
                  </div>
                </div>
              )}
              {formField.properties?.price != null && (
                <div className={styles.feeResponsibilityContainer}>
                  <p className={styles.paymentText}>{t("feeResponsible")}: </p>
                  <div className={styles.feeSwitchGroup}>
                    <p className={styles.requiredText}>{t("organization")}</p>
                    <Controller
                      name={`fields.${index}.properties.price.isCustomerPayingFee`}
                      control={control}
                      defaultValue={
                        formField.properties.price.isCustomerPayingFee
                      }
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(checked) => field.onChange(checked)}
                          offColor="#DFE5EE"
                          onColor="#DFE5EE"
                          offHandleColor="#AAAAAA"
                          onHandleColor="#B01254"
                          handleDiameter={24}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          height={16}
                          width={44}
                        />
                      )}
                    />
                    <p className={styles.requiredText}>{t("customer")}</p>
                  </div>
                </div>
              )}
              {formField.properties?.stripe_account != null && (
                <div className={styles.stripeGroup}>
                  <p className={styles.flexCenter}>
                    <b>{t("stripeAccount")}: </b>
                  </p>
                  {isLoading && <p>Loading...</p>}
                  {!isLoading &&
                    (stripeAccounts.length < 1 ? (
                      <button
                        className={styles.addStripeAccountButton}
                        onClick={() =>
                          (window.location.href = "/settings/payment")
                        }
                      >
                        Add Stripe Account
                      </button>
                    ) : (
                      <Controller
                        name={`fields.${index}.properties.stripe_account`}
                        control={control}
                        defaultValue={formField.properties.stripe_account}
                        render={({ field }) => (
                          <select
                            {...field}
                            className={styles.accountList}
                            onChange={(e) => {
                              try {
                                const parsedValue = JSON.parse(e.target.value);
                                field.onChange(parsedValue);
                              } catch (error) {
                                console.error(
                                  "Invalid JSON value:",
                                  e.target.value
                                );
                                // reset the value to the default account
                                field.onChange(
                                  formField?.properties?.stripe_account
                                );
                              }
                            }}
                            value={JSON.stringify(field.value)}
                          >
                            {displayStripeAccountOptions()}
                          </select>
                        )}
                      />
                    ))}
                </div>
              )}
              <div
                className={`${styles.extraOptions} ${
                  isContainerWidthMaxed ? styles.containerSmall : ""
                }`}
              >
                {formField.validations?.required != null && (
                  <>
                    <p className={styles.requiredText}>{t("requiredText")}</p>
                    <Controller
                      name={`fields.${index}.validations.required`}
                      control={control}
                      defaultValue={formField.validations.required}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onChange={(checked) => field.onChange(checked)}
                          offColor="#DFE5EE"
                          onColor="#DFE5EE"
                          offHandleColor="#AAAAAA"
                          onHandleColor="#B01254"
                          handleDiameter={24}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          height={16}
                          width={44}
                        />
                      )}
                    />
                  </>
                )}
              </div>
            </div>
            {isMenuOpen && (
              <DraggableSubMenu
                onDelete={onDelete}
                onCopy={onCopy}
                onClose={handleClick}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggablePayment;
