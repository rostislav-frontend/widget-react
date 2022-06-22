import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import styles from "./Widget.module.scss"
import refreshIcon from "../icons/refresh.svg"
export default function Widget() {

    let timerRef = useRef<NodeJS.Timeout>()

    const [date, setDate] = useState(new Date());
    
    function msToNextMinute(ms: number){
        return Math.round(ms / 60000);
    }

    function refreshClock() {
        let currentDate = new Date();
        setDate(currentDate)
        timerRef.current = setTimeout(refreshClock, msToNextMinute(currentDate.getMilliseconds()) )
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
    
  return (
    <section className={styles.wrapper}>
        <div>        </div>
        <div className={styles.time}>
            <div className={styles.timeTitle}><h1><b>Местное</b> время:</h1><img src={refreshIcon} alt="" /></div>
            <div className={styles.timeDate}>{format(date, "HH:mm")}</div>
        </div>
        <div className="widget-course">
            <div>USD</div>
            <div>EUR</div>
        </div>
    </section>
  )
}
