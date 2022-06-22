import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"

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
    <section className="widget-wrapper">
        <div className="widget-time">
            <div><h1>Местное время:</h1></div>
            <div>{format(date, "HH:mm")}</div>
        </div>
        <div className="widget-course">
            <div>USD</div>
            <div>EUR</div>
        </div>
    </section>
  )
}
