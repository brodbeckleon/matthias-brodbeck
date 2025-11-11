<script lang="ts">
    import { ChevronDown, Earth } from '@lucide/svelte';
    import { getLocale, setLocale } from '$lib/paraglide/runtime';

    let showLangDropdown = $state(false);

    export const availableLocales = ['en', 'de-ch', 'jp'] as const;
    type Locale = typeof availableLocales[number];

    function toggleDropdown() {
        showLangDropdown = !showLangDropdown;
    }

    function changeLanguage(lang: Locale) {
        setLocale(lang);
        showLangDropdown = false;
    }

    let current = getLocale();
</script>

<div class="lang-dropdown">
    <button class="dropdown-btn" onclick={toggleDropdown}>
        <Earth />{current} <ChevronDown class="chevron" />
    </button>

    {#if showLangDropdown}
        <div class="dropdown-menu">
            {#each availableLocales as lang}
                <div class="dropdown-item" onclick={() => changeLanguage(lang)}>
                    {lang}
                </div>
            {/each}
        </div>
    {/if}
</div>
