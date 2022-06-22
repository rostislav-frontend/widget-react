import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import styles from "./Widget.module.scss"
import axios from "axios"
import classNames from "classnames";
import { RefreshIcons } from "../icons/icons"
export default function Widget() {

    let timerRef = useRef<NodeJS.Timeout>()

    const [loading, setLoading] = useState<Boolean>(false)

    const [date, setDate] = useState(new Date());

    interface ICurrencies {
        EUR: number;
        USD: number;
    }
    let [currencies, setCurrencies] = useState<ICurrencies>();

    function msToNextMinute(ms: number) {
        return Math.round(ms / 60000);
    }

    function refreshClock() {
        let currentDate = new Date();
        setDate(currentDate)
        timerRef.current = setTimeout(refreshClock, msToNextMinute(currentDate.getMilliseconds()))
    }

    const getCurrencies = async () => {
        setLoading(true);
        let apiURL: string = 'https://cdn.cur.su/api/cbr.json'
        axios.get(apiURL).then((response) => {
            console.log(response.data.rates);
            setCurrencies(response.data.rates);
        });
        setLoading(false)
    }

    // update clock
    useEffect(() => {
        refreshClock();
        return function cleanup() {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        getCurrencies()
    }, [])

    return (
        <section className={styles.wrapper}>
            <div className={styles.wrapperTime}>
                <div className={styles.timeTitle}>
                    <div><h1><b>Местное</b> время:</h1></div>
                    <div className={classNames(styles["reload-button"], {
                        [styles["reload-button-loading"]]: loading
                    })} onClick={getCurrencies}><RefreshIcons /></div>
                </div>

                <div className={styles.timeDate}>{format(date, "HH:mm")}</div>
            </div>
            <div className={styles.course}>
                <div className={styles.courseTitle}>Курсы валют:</div>
                {currencies ? (
                    <>
                        <div>USD: {currencies.USD}</div>
                        <div>EUR: {currencies.EUR}</div>
                    </>
                ) : <div className={styles.currenciesError}>Не найдено</div>}


            </div>
        </section>
    )
}
