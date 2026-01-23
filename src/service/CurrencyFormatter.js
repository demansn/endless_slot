export class CurrencyFormatter {
    constructor() {
        const kUrlParams = new URLSearchParams(window.location.search);
        const currencyName = kUrlParams.has("currency") ? kUrlParams.get("currency") : "";

        this.currencyName = currencyName;
        this.currency = "";

        if ( currencyName ) {
            switch(currencyName)
            {
                case "USD": this.currency = "$"; break;
                case "EUR": this.currency = "€"; break;
                default: this.currency = currencyName;
            }
        }
    }

    format(value) {
        const number = value.toLocaleString( "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 } );

        return ` ${this.currency} ${number} `;
    }

    formatValue(value) {
        return value.toLocaleString( "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 } );
    }
}
