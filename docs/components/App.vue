<template>
    <div id="layout" v-el:layout>
        <!-- Menu toggle -->
        <a href="#menu" id="menuLink" class="menu-link" v-el:menuLink>
            <!-- Hamburger icon -->
            <span></span>
        </a>

        <div id="menu" v-el:menu>
            <div class="pure-menu">
                <a href="/" class="pure-menu-heading">Vue Validation</a>
                <ul class="pure-menu-list">
                    <li class="pure-menu-item">
                        <a href="index.html#installation" class="pure-menu-link">Installation</a>
                    </li>
                    <li class="pure-menu-item">
                        <a href="index.html#basic-example" class="pure-menu-link">Basic Example</a>
                    </li>
                    <li class="pure-menu-item">
                        <a href="index.html#render-errors" class="pure-menu-link">Rendering Errors</a>
                    </li>
                </ul>
            </div>
        </div>

        <div id="main">
            <div class="header">
                <h1>{{ heading }}</h1>
                <h2>{{ subtitle }}</h2>
            </div>
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['heading', 'subtitle', 'selected'],

    ready() {
        const layout = this.$els.layout;
        const menu = this.$els.menu;
        const menuLink = this.$els.menulink;

        const toggleClass = (element, className) => {
            const classes = element.className.split(/\s+/);
            const length = classes.length;

            for(let i = 0; i < length; i++) {
                if (classes[i] === className) {
                    classes.splice(i, 1);
                    break;
                }
            }
            // The className is not found
            if (length === classes.length) {
                classes.push(className);
            }

            element.className = classes.join(' ');
        }

        menuLink.onclick = (e) => {
            const active = 'active';

            e.preventDefault();
            toggleClass(layout, active);
            toggleClass(menu, active);
            toggleClass(menuLink, active);
        };
    }
}
</script>
