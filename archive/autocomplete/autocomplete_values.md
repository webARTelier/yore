## General Input Fields
- `on` – Enables autocomplete (default)
- `off` – Disables autocomplete

## Personal Information
- `name` – Full name
- `given-name` – First name
- `additional-name` – Middle name
- `family-name` – Last name
- `nickname` – Nickname
- `username` – Username
- `new-password` – New password
- `current-password` – Current password
- `one-time-code` – One-time security code

## Contact Information
- `email` – Email address
- `tel` – Phone number
- `tel-country-code` – Country dialing code
- `tel-national` – National phone number (without country code)
- `tel-area-code` – Area code
- `tel-local` – Local phone number
- `tel-extension` – Telephone extension
- `impp` – Instant messaging profile (e.g., Skype, Telegram)

## Address Fields
- `street-address` – Full street address
- `address-line1` – First address line
- `address-line2` – Second address line
- `address-line3` – Third address line
- `country` – Country code (ISO 3166-1 Alpha-2, e.g., "US" for the United States)
- `country-name` – Full country name
- `postal-code` – ZIP or postal code
- `region` – State or region
- `city` – City
- `district` – Neighborhood or district

## Payment Information
- `cc-name` – Cardholder name
- `cc-given-name` – Cardholder's first name
- `cc-family-name` – Cardholder's last name
- `cc-number` – Credit card number
- `cc-exp` – Expiration date (MM/YY or MM/YYYY)
- `cc-exp-month` – Expiration month (MM)
- `cc-exp-year` – Expiration year (YY or YYYY)
- `cc-csc` – Security code (CVC, CVV)
- `cc-type` – Card type (Visa, Mastercard, etc.)
- `transaction-currency` – Currency (ISO 4217, e.g., "USD")
- `transaction-amount` – Transaction amount

## Additional Information
- `bday` – Birthdate (YYYY-MM-DD)
- `bday-day` – Day of birth (DD)
- `bday-month` – Month of birth (MM)
- `bday-year` – Year of birth (YYYY)
- `sex` – Gender (e.g., "male", "female", "other")
- `language` – Preferred language (ISO 639-1, e.g., "en" for English)
- `organization` – Company name
- `organization-title` – Job title

## Shipping and Billing Information
- `shipping` – Marks the address as a shipping address
- `billing` – Marks the address as a billing address

## Example: Autocomplete in HTML
```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" autocomplete="email">
  
  <label for="cc-number">Credit Card Number:</label>
  <input type="text" id="cc-number" name="cc-number" autocomplete="cc-number">

  <button type="submit">Submit</button>
</form>
