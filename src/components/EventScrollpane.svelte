<script lang="ts">
    import { Spring } from 'svelte/motion';

    type Event = {
        date: string;
        title: string;
        place: string;
    };

    let { events = [] }: { events: Event[] } = $props();

    // Default events if none are provided through props
    if (events.length === 0) {
        events = [
            { date: '2024-06-30', title: 'Summer Drum Festival', place: 'Osaka City Hall' },
            { date: '2024-10-14', title: 'Percussion Workshop', place: 'Tokyo Jazz School' },
            { date: '2024-12-10', title: 'Winter Groove Session', place: 'Kobe Arts Center' },
            { date: '2025-01-12', title: 'New Year Concert', place: 'Kyoto Concert Hall' },
            { date: '2025-03-22', title: 'Rhythm of Spring', place: 'Nagoya Dome' },
            { date: '2025-05-15', title: 'Drum Tales', place: 'Hiroshima Sound Museum' },
            { date: '2025-09-01', title: 'Autumn Percussion Gala', place: 'Fukuoka Harmony Hall' },
            { date: '2025-12-05', title: 'End of Year Celebration', place: 'Tokyo Philharmonic' }
        ];
    }

    const ITEM_SPACING = 100;
    let listContainerEl: HTMLElement;
    let scrollTop = $state(0);

    const scrollIndex = $derived(scrollTop / ITEM_SPACING);

    const smoothScrollIndex = new Spring(scrollIndex);
    $effect(() => {
        smoothScrollIndex.set(scrollIndex);
    });


    function findNextEventIndex() {
        const today = new Date();
        const nextEventIndex = events.findIndex(e => new Date(e.date) >= today);
        return nextEventIndex === -1 ? events.length - 1 : nextEventIndex;
    }

    function scrollToToday() {
        if (!listContainerEl) return;

        const targetIndex = findNextEventIndex();
        const targetScrollTop = targetIndex * ITEM_SPACING;

        listContainerEl.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }
</script>

<div class="scroller">
    <button class="jump" onclick={scrollToToday}>Go to Today / Next Event</button>

    <div
            class="list-container"
            bind:this={listContainerEl}
            onscroll={(e) => (scrollTop = e.currentTarget.scrollTop)}
    >
        {#each events as event, i}
            <div
                    class="event"
                    style:transform="scale({1 - Math.abs(i - $smoothScrollIndex) * 0.15})"
                    style:opacity={Math.max(0, 1 - Math.abs(i - $smoothScrollIndex) * 0.4)}
                    style:z-index={100 - Math.floor(Math.abs(i - $smoothScrollIndex))}
            >
                <p class="date">{event.date}</p>
                <h3>{event.title}</h3>
                <p class="place">{event.place}</p>
            </div>
        {/each}
    </div>
</div>

<style>
    :root {
        --list-height: 350px;
        --item-height: 70px;
        --item-gap: 30px;
    }

    .scroller {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: system-ui, sans-serif;
        overflow: hidden;
        gap: 1.5rem;
    }

    /* The main scrollable container */
    .list-container {
        height: var(--list-height);
        width: 100%;
        max-width: 500px;
        overflow-y: scroll;
        /* snapping makes the scroll stop with an item perfectly centered */
        scroll-snap-type: y mandatory;
        scroll-behavior: smooth;
        /* Hide the scrollbar for a cleaner look */
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--item-gap);
    }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .list-container::-webkit-scrollbar {
        display: none;
    }


    /* Padding is used to ensure the first and last items can be centered */
    .list-container {
        padding-top: calc(var(--list-height) / 2 - var(--item-height) / 2);
        padding-bottom: calc(var(--list-height) / 2 - var(--item-height) / 2);
    }

    .event {
        /* Each event is a snap point */
        scroll-snap-align: center;

        flex-shrink: 0; /* Prevent items from shrinking */
        width: 90%;
        height: var(--item-height);
        text-align: center;
        padding: 1rem;
        border-radius: 1rem;
        background: var(--bg-secondary);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        /* Use will-change to hint to the browser about upcoming transformations */
        will-change: transform, opacity;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: transform 0.1s linear, opacity 0.1s linear;
    }

    .date {
        font-size: 0.9rem;
        opacity: 0.7;
        margin: 0;
    }
    h3 {
        margin: 0.2rem 0;
    }
    .place {
        font-size: 0.9rem;
        opacity: 0.8;
        margin: 0;
    }

    .jump {
        background: var(--accent);
        color: var(--bg);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.7rem;
        font-size: 0.9rem;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    .jump:hover {
        background: var(--text);
        color: var(--bg);
    }
</style>