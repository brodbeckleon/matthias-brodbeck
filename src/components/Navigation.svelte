<script lang="ts">
    import { Facebook, Instagram, Youtube } from '@lucide/svelte';
    import { m } from '$lib/paraglide/messages.js';
    import LanguageDropDown from "./LanguageDropDown.svelte";

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Upcoming Events', href: '/events' },
        { name: 'Music', href: '/music' },
        { name: 'Contact', href: '/contact' }
    ];

    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/matthias.brodbeck.7' },
        { icon: Instagram, href: 'https://www.instagram.com/brodbeckmatthias/' },
        { icon: Youtube, href: 'https://www.youtube.com/@matthiasbrodbeck7950' }
    ];
</script>

<nav class="navbar">
    <!-- Top Row -->
    <div class="top-row">
        <div class="social-icons">
            {#each socialLinks as { icon, href }}
                <a href={href} target="_blank" rel="noopener noreferrer" class="icon-link">
                    <svelte:component this={icon} />
                </a>
            {/each}
        </div>

        <div class="title-row">
            <div class="title">Matthias Brodbeck</div>
            <div class="tagline">{m.drummer_and_teacher()}</div>
        </div>

        <!-- Language Dropdown -->
        <LanguageDropDown/>
    </div>
    <!-- Bottom Row -->

    <div class="nav-links">
        {#each navLinks as { name, href }}
            <a href={href}>{name}</a>
        {/each}
    </div>
</nav>

