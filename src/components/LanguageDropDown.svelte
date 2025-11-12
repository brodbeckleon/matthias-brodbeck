<script lang="ts">
    import { ChevronDown, Earth } from '@lucide/svelte';
    import { getLocale, setLocale } from '$lib/paraglide/runtime';

    let showLangDropdown = $state(false);

    export const availableLocales = ['en', 'de-ch', 'jp'] as const;
    export const availableLocaleNames = {
        en: 'English',
        'de-ch': 'Deutsch',
        jp: '日本語'
    };

    type Locale = (typeof availableLocales)[number];

    function toggleDropdown() {
        showLangDropdown = !showLangDropdown;
    }

    function changeLanguage(lang: Locale) {
        setLocale(lang);
        showLangDropdown = false;
    }

    let current = getLocale();
</script>

<div class="language-dropdown">
    <button class="dropdown-btn" onclick={toggleDropdown}>
        <Earth class="icon" />
        <span class="lang-label">{availableLocaleNames[current]}</span>
        <ChevronDown class={showLangDropdown ? 'chevron rotated' : 'chevron'} />
    </button>

    {#if showLangDropdown}
        <div class="language-dropdown-menu">
            {#each availableLocales as lang}
                <button class="dropdown-item" onclick={() => changeLanguage(lang)}>
                    {availableLocaleNames[lang]}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="css">
    .language-dropdown {
        position: relative;
        flex-shrink: 0;
        display: inline-block;
    }

    .dropdown-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: none;
        border: 1px solid var(--text-muted);
        border-radius: 6px;
        color: var(--text);
        cursor: pointer;
        line-height: 1;
        white-space: nowrap;
        transition: background-color 0.2s, transform 0.2s;
        width: max-content;
        min-width: 100px;
        justify-content: space-between;
    }

    .dropdown-btn:hover {
        background-color: var(--bg-secondary);
        transform: scale(1.03);
    }

    .language-dropdown-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: var(--bg-secondary);
        border: 1px solid var(--text-muted);
        border-radius: 6px;
        padding: 5px 0;
        z-index: 200;
        width: 100%;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    /* Each language entry */
    .dropdown-item {
        /* Add styles to make button look like the div did */
        background: none;
        border: none;
        display: block; /* Make it take full width */
        text-align: left; /* Align text to the left */
        width: 100%;

        padding: 6px 12px;
        cursor: pointer;
        color: var(--text);
        white-space: nowrap;
    }

    .dropdown-item:hover {
        background-color: var(--accent);
        color: var(--bg);
    }

    /* FIX 2: Use :global() for child component styles */
    :global(.icon) {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }

    :global(.chevron) {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(.chevron.rotated) {
        transform: rotate(180deg);
    }
</style>