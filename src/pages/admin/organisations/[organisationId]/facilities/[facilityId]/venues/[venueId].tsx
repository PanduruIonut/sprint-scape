
import { Card, Center, Button } from "@chakra-ui/react";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import { useRouter } from "next/router";
import { useState } from "react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import '@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css'
import 'react-clock/dist/Clock.css';
import { api } from "@/utils/api";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import toast from "react-hot-toast";
import { type Value } from "@wojtekmaj/react-timerange-picker/dist/cjs/shared/types";


export default function Venue() {
    const [bookingTime, setBookingTime] = useState<null | Value | undefined>();
    const [bookingDate, setBookingDate] = useState<null | Date | Value>(new Date());
    const router = useRouter()
    const venueId = router.query.venueId as string
    const venue = api.venue.getOne.useQuery({ id: venueId })

    const bookings = api.booking.getAllBookingsForVenue.useQuery({ venueId: venueId })
    const events = bookings.data?.map((booking) => {
        return {
            title: '',
            start: booking.startTime,
            end: booking.endTime,
        }
    })


    const { mutate, data } = api.booking.create.useMutation({
        onSuccess: () => {
            toast.success(`Booking created! ${data ? data.startTime.toString() : ''}`);
        },
        onError: (e) => {
            if (e.message) {
                toast.error(e.message)
                return
            }
            const errorMessage = e.data?.zodError?.fieldErrors.content;
            if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
            } else {
                toast.error("Failed to post! Please try again later.");
            }
        },
    });

    const createBooking = () => {
        if (!bookingDate) {
            toast.error("Please select a date")
            return
        }
        if (!bookingTime) {
            toast.error("Please select a time")
            return
        }
        const startBookingDateTime = new Date(bookingDate.toString())
        const bookingStartTimeHours = typeof bookingTime === 'string'
            ? bookingTime.split(':')[0]
            : bookingTime instanceof Date
                ? bookingTime.getHours().toString()
                : bookingTime instanceof Array && bookingTime.length > 0 && typeof bookingTime[0] === 'string'
                    ? bookingTime[0].split(':')[0]
                    : '';
        let bookingStartTimeMinutes = ''
        if (typeof bookingTime === 'string') {
            bookingStartTimeMinutes = bookingTime.split(':')[1] || '';
        } else if (bookingTime instanceof Date) {
            bookingStartTimeMinutes = bookingTime.getMinutes().toString();
        } else if (
            Array.isArray(bookingTime) &&
            bookingTime.length > 0 &&
            typeof bookingTime[0] === 'string'
        ) {
            bookingStartTimeMinutes = bookingTime[0].split(':')[1] || '';
        }
        if (!bookingStartTimeHours || !bookingStartTimeMinutes) {
            return
        }
        startBookingDateTime.setHours(parseInt(bookingStartTimeHours, 10))
        startBookingDateTime.setMinutes(parseInt(bookingStartTimeMinutes, 10))

        const endBookingDateTime = new Date(bookingDate.toString())
        let bookingEndTimeHours = '';

        if (Array.isArray(bookingTime) && bookingTime.length > 1 && typeof bookingTime[1] === 'string') {
            bookingEndTimeHours = bookingTime[1].split(':')[0] || '';
        }
        let bookingEndTimeMinutes = '';

        if (
            Array.isArray(bookingTime) &&
            bookingTime.length > 1 &&
            typeof bookingTime[1] === 'string'
        ) {
            bookingEndTimeMinutes = bookingTime[1].split(':')[1] || '';
        }
        if (!bookingEndTimeHours || !bookingEndTimeMinutes) {
            return
        }
        endBookingDateTime.setHours(parseInt(bookingEndTimeHours, 10))
        endBookingDateTime.setMinutes(parseInt(bookingEndTimeMinutes, 10))

        if (venue.data?.facilityId === undefined || venue.data?.facilityId === null) {
            toast.error("Venue has no facilityId")
            return
        }
        mutate({
            content: {
                facilityId: venue.data.facilityId,
                venueId: venueId,
                startTime: startBookingDateTime,
                endTime: endBookingDateTime,
            }
        })
    }

    return (
        <Center height='100vh' width='100vw'>
            <Card boxShadow='2xl' variant='outline' align='center' minWidth='4xl' maxW={'400px'} height='800px' p={30}>
                <div style={{ padding: '20px' }}>
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontWeight: 'bold', fontSize: '20px', margin: '10px' }}>{venue.data?.name}</h1>
                <span style={{ fontStyle: 'italic' }}>{venue.data?.description}</span>
                <span>Max Capacity: {venue.data?.maxPlayersCapacity}</span>
                <span>Type: {venue.data?.type}</span>
                    </div>
                </div>
                <div style={{ margin: '1rem', height: '400px', overflow: 'auto' }}>
                    <FullCalendar
                        plugins={[timeGridPlugin, interactionPlugin]}
                        initialView='timeGridWeek'
                        height='auto'
                        contentHeight='auto'
                        aspectRatio={0.5}
                        events={events}
                    />
                </div>
                <div style={{ display: "flex", width: "100%", justifyContent: 'center' }}>
                    <DatePicker onChange={(value) => setBookingDate(value)} value={bookingDate} calendarIcon={null} clearIcon={null} />
                    <TimeRangePicker onChange={(value) => setBookingTime(value)} value={bookingTime} />
                </div>

                <Button m={10} onClick={() => createBooking()}>Book</Button>
            </Card>
        </Center >
    )
}