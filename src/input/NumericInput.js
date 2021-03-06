import React, { PureComponent } from 'react';

type Props = {
    className: string,
    decimals: number,
    min: number,
    max: number,
    integer: boolean,
    defaultValue: number,
    valueList: number[],
    onChange: (newValue: number) => void,
}

export default class NumericInput extends PureComponent {

    props: Props;

    state: {
        value: string,
    }

    static defaultProps = {
        defaultValue: 0,
        decimals: 2,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            value: props.defaultValue.toString(),
        };
    }

    step = () => {
        const { value } = this.state;
        const notInt = +value % 1 !== 0;

        return notInt || value === '0' ?
            0.1 :
            10 ** (value.length - 1);
    }

    // this function will perform checks on new value and change it automatically
    addDiffWithChecks = (diff: number) => {
        const { decimals, min, max } = this.props;
        const value = +this.state.value;
        let newValue = +((value + diff).toFixed(decimals));

        if (newValue > max) {
            newValue = max;
        } else if (newValue < min) {
            newValue = min;
        }

        this.changeValue(newValue);
    }

    onStepUp = () =>
        this.addDiffWithChecks(this.step());

    onStepDown = () => {
        const smallerStepDown = (this.state.value).toString()[0] === '1';
        this.addDiffWithChecks(smallerStepDown ? -this.step() / 10 : -this.step());
    }

    // this function should not check and change input value automatically!!
    // as invalid value could be intermediate value of valid value
    // eg. empty value
    changeValue = (newValue: number) => {
        const { integer } = this.props;

        const value = (newValue && integer) ? Math.floor(newValue) : newValue;

        this.setState({ value: value ? value.toString() : undefined });
        const { onChange } = this.props;
        if (onChange) onChange(+value);
    }

    onChange = (e: any) =>
        this.changeValue(e.target.value);

    render() {
        const { integer, className, min, max, valueList } = this.props;
        const { value } = this.state;
        const iosHackEnabled = integer && navigator && navigator.userAgent.match(/iP(ad|hone)/i);

        return (
            <div className={className}>
                <button className="btn-flat step-down" onClick={this.onStepDown}>&ndash;</button>
                <input
                    type={iosHackEnabled ? 'tel' : 'number'}
                    value={value}
                    min={min}
                    max={max}
                    step={this.step()}
                    list="values"
                    onChange={this.onChange}
                />
                <button className="btn-flat step-up" onClick={this.onStepUp}>+</button>
                {valueList &&
                    <datalist id="values">
                        {valueList.map((x: number) =>
                            <option key={x} value={x} />
                        )}
                    </datalist>
                }
            </div>
        );
    }
}
