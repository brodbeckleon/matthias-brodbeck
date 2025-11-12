<script lang="ts">
    import { Facebook, Instagram, Youtube } from '@lucide/svelte';
    import { m } from '$lib/paraglide/messages.js';
    import LanguageDropDown from "./LanguageDropDown.svelte";
    import ThemeToggler from "./ThemeToggler.svelte";

    const navLinks = [
        { name: m.home(), href: '/' },
        { name: m.events(), href: '/events' },
        { name: m.music(), href: '/music' },
        { name: m.gallery(), href: '/gallery' },
        { name: m.contact(), href: '/contact' }
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
            <div class="tagline">{m.drums_and_percussion()}</div>
        </div>

        <div class="settings">
            <ThemeToggler/>
            <LanguageDropDown/>
        </div>
    </div>
    <!-- Bottom Row -->

    <div class="nav-links">
        {#each navLinks as { name, href }}
            <a href={href}>{name}</a>
        {/each}
    </div>
</nav>

