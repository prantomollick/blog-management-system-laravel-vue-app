<script setup>
import LoginModal from "@/Components/auth/LoginModal.vue"; // Import login modal component
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Link, usePage, router } from "@inertiajs/vue3";
import {
    Bell,
    BookOpen,
    Home,
    LayoutDashboard, // Hamburger Icon
    LogOut, // Notification Icon
    Menu,
    PlusCircle,
    Search,
    Settings,
    User,
    Mail,
} from "lucide-vue-next"; // Import search icon
import { computed, ref } from "vue";

import RegistrationModal from "@/Components/auth/RegistrationModal.vue";
import { Toaster } from "@/Components/ui/sonner";
import { useModalStore } from "@/stores/modal"; // Import modal store

import DropdownLink from "@/Components/DropdownLink.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

const appName = import.meta.env.VITE_APP_NAME || "BlogApp"; // Get app name from .env or default
const searchInput = ref("");
const modalStore = useModalStore(); // Initialize modal store

const showingMobileMenu = ref(false);

// Get authenticated user data from Inertia shared props
const page = usePage();
const user = computed(() => page.props.auth.user);

// --- Computed property for user initials (fallback) ---
const userInitials = computed(() => {
    if (user.value?.name) {
        return (
            user.value.name
                .match(/\b(\w)/g)
                ?.join("")
                .substring(0, 2)
                .toUpperCase() || "??"
        );
    }
    return "??";
});

// --- NEW: Placeholder Notification Data ---
const notifications = ref([
    {
        id: 1,
        type: "comment",
        text: 'Alice commented on your post "Vue 3 Composition API".',
        time: "5m ago",
        read: false,
        href: "#",
    },
    {
        id: 2,
        type: "like",
        text: 'Bob liked your post "Laravel Inertia Setup".',
        time: "1h ago",
        read: false,
        href: "#",
    },
    {
        id: 3,
        type: "follow",
        text: "Charlie started following you.",
        time: "3h ago",
        read: true,
        href: "#",
    },
    {
        id: 4,
        type: "mention",
        text: "David mentioned you in a comment.",
        time: "1d ago",
        read: true,
        href: "#",
    },
]);

const unreadCount = computed(
    () => notifications.value.filter((n) => !n.read).length
);

// --- NEW: Function to mark a notification as read (example) ---
const markAsRead = (notificationId) => {
    const notification = notifications.value.find(
        (n) => n.id === notificationId
    );
    if (notification) {
        notification.read = true;
        // In a real app, you'd also send an API request here
        // to update the backend.
        console.log(`Marked notification ${notificationId} as read.`);
        // TODO: Add API call here
    }

    // Navigate even if already read
    if (notification?.href) {
        router.visit(notification.href);
    }
};

// --- NEW: Function to mark all as read (example) ---
const markAllAsRead = () => {
    let markedAny = false;
    notifications.value.forEach((n) => {
        if (!n.read) {
            n.read = true;
            markedAny = true;
        }
    });
    if (markedAny) {
        console.log("Marked all as read.");
        // TODO: Add API call here
    }
};

if (user) {
    console.log("User is  authenticated");
}

// Function to handle search submission (implement later)
const handleSearch = () => {
    if (!searchInput.value.trim()) return;
    // router.get(
    //     route("posts.index"),
    //     { search: searchInput.value },
    //     {
    //         preserveState: true,
    //         replace: true,
    //     }
    // );
    // Inertia visit or other search logic here
    // router.get(route('posts.index', { search: searchInput.value }));
};

router.on("navigate", () => {
    showingMobileMenu.value = false;
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
        <nav
            class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50"
        >
            <!-- Primary Navigation Menu -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- Logo -->
                    <div class="shrink-0 flex items-center">
                        <Link :href="route('home')">
                            <img
                                class="h-7 w-auto"
                                src="/images/blogx-logo.png"
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    <!-- Search Box -->
                    <div class="hidden sm:flex sm:items-center sm:ml-6">
                        <form
                            @submit.prevent="handleSearch"
                            class="relative w-full max-w-xs lg:max-w-sm"
                        >
                            <Input
                                type="search"
                                placeholder="Search posts..."
                                class="pr-10"
                                v-model="searchInput"
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                class="absolute right-0 top-0 h-full px-3"
                                aria-label="Search"
                            >
                                <Search
                                    class="h-4 w-4 text-gray-500 dark:text-gray-400"
                                />
                            </Button>
                        </form>
                    </div>

                    <!-- Login/Register Links -->
                    <!-- Right Side Navigation (Desktop) -->
                    <div class="hidden sm:flex sm:items-center sm:ml-6">
                        <template v-if="!user">
                            <Button
                                class="mr-4 cursor-pointer"
                                variant="link"
                                @click="modalStore.showModal('login')"
                            >
                                Log in
                            </Button>

                            <Button
                                variant="default"
                                @click="modalStore.showModal('register')"
                            >
                                Create Account
                            </Button>
                        </template>

                        <!-- Authenticated Links -->
                        <template v-else>
                            <Button
                                variant="default"
                                size="sm"
                                class="mr-4"
                                as-child
                            >
                                <Link :href="route('login')">
                                    <!-- Assuming posts.create route -->
                                    <PlusCircle class="h-4 w-4 mr-2" /> Create
                                    Post
                                </Link>
                            </Button>

                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="relative mr-4 rounded-full"
                                        aria-label="Notifications"
                                    >
                                        <Bell class="h-5 w-5" />
                                        <!-- Unread count badge  -->
                                        <span
                                            v-if="unreadCount > 0"
                                            class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
                                        >
                                            {{
                                                unreadCount > 9
                                                    ? "9+"
                                                    : unreadCount
                                            }}
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="end"
                                    class="w-80 md:w-96 p-0"
                                >
                                    <div class="p-4 border-b">
                                        <h4 class="font-medium leading-none">
                                            Notifications
                                        </h4>
                                        <p
                                            class="text-sm text-muted-foreground mt-1"
                                        >
                                            You have {{ unreadCount }} unread
                                            messages.
                                        </p>
                                    </div>
                                    <div class="p-2 max-h-80 overflow-y-auto">
                                        <div
                                            v-if="notifications.length === 0"
                                            class="text-center text-sm text-muted-foreground py-8"
                                        >
                                            No new notifications.
                                        </div>
                                        <div v-else>
                                            <a
                                                v-for="notification in notifications"
                                                :key="notification.id"
                                                :href="notification.href"
                                                @click.prevent="
                                                    markAsRead(notification.id);
                                                    router.visit(
                                                        notification.href
                                                    );
                                                "
                                                class="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
                                                :class="{
                                                    'opacity-60':
                                                        notification.read,
                                                }"
                                            >
                                                <div
                                                    class="flex items-start space-x-3"
                                                >
                                                    <!-- Icon based on type (optional) -->
                                                    <!-- <Mail v-if="notification.type === 'message'" class="h-4 w-4 mt-1 text-muted-foreground" /> -->
                                                    <span
                                                        v-if="
                                                            !notification.read
                                                        "
                                                        class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 flex-shrink-0"
                                                    />
                                                    <span
                                                        v-else
                                                        class="flex h-2 w-2 translate-y-1 rounded-full bg-transparent flex-shrink-0"
                                                    />

                                                    <div
                                                        class="flex-1 space-y-1"
                                                    >
                                                        <p
                                                            class="text-sm font-medium leading-none"
                                                        >
                                                            {{
                                                                notification.text
                                                            }}
                                                        </p>
                                                        <p
                                                            class="text-xs text-muted-foreground"
                                                        >
                                                            {{
                                                                notification.time
                                                            }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                    <div
                                        v-if="notifications.length > 0"
                                        class="p-2 border-t flex justify-between items-center"
                                    >
                                        <Button
                                            variant="link"
                                            size="sm"
                                            class="text-xs"
                                            @click="markAllAsRead"
                                        >
                                            Mark all as read
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            class="text-xs"
                                            disabled
                                        >
                                            <!-- Link to a full notification page -->
                                            View all
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <!-- User Dropdown -->
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button
                                        variant="ghost"
                                        class="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        aria-label="User menu"
                                    >
                                        <Avatar class="h-8 w-8">
                                            <AvatarImage
                                                :src="'https://github.com/unovue.png'"
                                                :alt="user.name"
                                                v-if="user.profile_pic"
                                            />
                                            <AvatarFallback>{{
                                                userInitials
                                            }}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" class="w-56">
                                    <!-- Section 1: User Info -->
                                    <DropdownMenuLabel class="font-normal">
                                        <div class="flex flex-col space-y-1">
                                            <p
                                                class="text-sm font-medium leading-none"
                                            >
                                                {{ user.name }}
                                            </p>
                                            <p
                                                class="text-xs leading-none text-muted-foreground"
                                            >
                                                @{{ user.username }}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <!-- Section 2: Links -->
                                    <DropdownMenuItem as-child>
                                        <Link :href="route('dashboard')">
                                            <!-- Assuming dashboard route -->
                                            <LayoutDashboard
                                                class="mr-2 h-4 w-4"
                                            />
                                            <span>Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem as-child>
                                        <Link :href="route('login')">
                                            <!-- Assuming posts.create route -->
                                            <PlusCircle class="mr-2 h-4 w-4" />
                                            <span>Create Post</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <!-- Example: Reading List (implement later) -->
                                        <BookOpen class="mr-2 h-4 w-4" />
                                        <span>Reading List</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem as-child>
                                        <!-- Assuming profile.edit route -->
                                        <Link :href="route('login')">
                                            <Settings class="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <!-- Section 3: Sign Out -->
                                    <DropdownLink
                                        :href="route('logout')"
                                        method="post"
                                        as="button"
                                        class="cursor-pointer flex items-center"
                                    >
                                        <LogOut class="mr-2 h-4 w-4" />
                                        <span>Sign Out</span>
                                    </DropdownLink>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </template>
                    </div>

                    <!-- Hamburger Menu Trigger (Mobile) -->
                    <div class="-mr-2 flex items-center sm:hidden">
                        <!-- Search Icon (Optional on Mobile - can be inside Sheet) -->
                        <!--
                        <Button variant="ghost" size="icon" class="mr-2" @click="/* Open search logic */">
                            <Search class="h-5 w-5" />
                        </Button>
                        -->

                        <!--  Mobile Notification Popover  Add
                        v-if="user" so it only shows when logged in  -->
                        <Popover v-if="user">
                            <PopoverTrigger as-child>
                                <!-- This Button triggers the mobile popover  -->
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="relative mr-2 rounded-full"
                                    aria-label="Notifications"
                                >
                                    <Bell class="h-5 w-5" />
                                    <span
                                        v-if="unreadCount > 0"
                                        class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
                                    >
                                        {{
                                            unreadCount > 9 ? "9+" : unreadCount
                                        }}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <!-- Use the SAME PopoverContent structure as desktop -->

                            <PopoverContent
                                align="end"
                                class="w-[90vw] sm:w-80 md:w-96 p-0"
                            >
                                <!-- Popover Content START 
                                (Duplicated content block - Consider abstracting
                                to a component later if it grows complex)  -->
                                <div class="p-4 border-b">
                                    <h4 class="font-medium leading-none">
                                        Notifications
                                    </h4>
                                    <p
                                        class="text-sm text-muted-foreground mt-1"
                                    >
                                        You have {{ unreadCount }} unread
                                        messages.
                                    </p>
                                </div>
                                <div class="p-2 max-h-80 overflow-y-auto">
                                    <div
                                        v-if="notifications.length === 0"
                                        class="text-center text-sm text-muted-foreground py-8"
                                    >
                                        No new notifications.
                                    </div>
                                    <div v-else>
                                        <a
                                            v-for="notification in notifications"
                                            :key="notification.id"
                                            :href="notification.href"
                                            @click.prevent="
                                                markAsRead(notification.id)
                                            "
                                            class="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                                            :class="{
                                                'opacity-60': notification.read,
                                            }"
                                        >
                                            <div
                                                class="flex items-start space-x-3"
                                            >
                                                <span
                                                    v-if="!notification.read"
                                                    class="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500 flex-shrink-0"
                                                />
                                                <span
                                                    v-else
                                                    class="flex h-2 w-2 translate-y-1 rounded-full bg-transparent flex-shrink-0"
                                                />
                                                <div class="flex-1 space-y-1">
                                                    <p
                                                        class="text-sm font-medium leading-none"
                                                    >
                                                        {{ notification.text }}
                                                    </p>
                                                    <p
                                                        class="text-xs text-muted-foreground"
                                                    >
                                                        {{ notification.time }}
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div
                                    v-if="notifications.length > 0"
                                    class="p-2 border-t flex justify-between items-center"
                                >
                                    <Button
                                        variant="link"
                                        size="sm"
                                        class="text-xs h-auto py-1 px-2"
                                        @click="markAllAsRead"
                                    >
                                        Mark all as read
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        class="text-xs h-auto py-1 px-2"
                                        disabled
                                    >
                                        View all
                                    </Button>
                                </div>
                                <!-- Popover Content END -->
                            </PopoverContent>
                        </Popover>
                        <!-- --- END Mobile Notification Popover ---  -->

                        <!-- Hamburger -->
                        <Sheet v-model:open="showingMobileMenu">
                            <SheetTrigger as-child>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                                    aria-label="Open main menu"
                                >
                                    <Menu class="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                class="w-[280px] sm:w-[320px]"
                            >
                                <SheetHeader class="mb-4 border-b pb-4">
                                    <SheetTitle as-child>
                                        <Link
                                            :href="route('home')"
                                            class="flex items-center gap-2"
                                            @click="showingMobileMenu = false"
                                        >
                                            <img
                                                class="h-6 w-auto"
                                                src="/images/blogx-logo.png"
                                                alt="Logo"
                                            />
                                        </Link>
                                    </SheetTitle>
                                    <!-- Optional: SheetDescription -->
                                </SheetHeader>

                                <div class="flex flex-col space-y-2 px-4">
                                    <!-- Mobile Navigation Links -->
                                    <Button
                                        variant="ghost"
                                        class="justify-start"
                                        as-child
                                    >
                                        <Link :href="route('home')">
                                            <Home class="mr-2 h-4 w-4" /> Home
                                        </Link>
                                    </Button>

                                    <!-- Authenticated Mobile Links -->
                                    <template v-if="user">
                                        <Button
                                            variant="ghost"
                                            class="justify-start"
                                            as-child
                                        >
                                            <Link :href="route('dashboard')">
                                                <LayoutDashboard
                                                    class="mr-2 h-4 w-4"
                                                />
                                                Dashboard
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            class="justify-start"
                                            as-child
                                        >
                                            <Link :href="route('login')">
                                                <PlusCircle
                                                    class="mr-2 h-4 w-4"
                                                />
                                                Create Post
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            class="justify-start"
                                            disabled
                                        >
                                            <BookOpen class="mr-2 h-4 w-4" />
                                            Reading List
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            class="justify-start"
                                            as-child
                                        >
                                            <Link :href="route('login')">
                                                <Settings
                                                    class="mr-2 h-4 w-4"
                                                />
                                                Settings
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            class="justify-start text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                                            as-child
                                        >
                                            <Link :href="route('logout')">
                                                <!-- Assuming logout route -->
                                                <LogOut class="mr-2 h-4 w-4" />
                                                Sign Out
                                            </Link>
                                        </Button>
                                    </template>

                                    <!-- Guest Mobile Links -->
                                    <template v-else>
                                        <Button
                                            variant="ghost"
                                            class="justify-start"
                                            as-child
                                        >
                                            <Link :href="route('login')">
                                                <User class="mr-2 h-4 w-4" />
                                                Log In
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="default"
                                            class="w-full justify-center"
                                            as-child
                                        >
                                            <Link :href="route('register')">
                                                Create Account
                                            </Link>
                                        </Button>
                                    </template>

                                    <!-- Mobile Search (Optional - can place it here) -->
                                    <form
                                        @submit.prevent="handleSearch"
                                        class="relative pt-4"
                                    >
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            class="pr-10 w-full"
                                            v-model="searchInput"
                                        />
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            class="absolute right-1 top-1/2 mt-2 -translate-y-1/2 h-8 w-8"
                                            aria-label="Search"
                                        >
                                            <Search
                                                class="h-4 w-4 text-muted-foreground"
                                            />
                                        </Button>
                                    </form>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Page Heading (Optional) -->
        <header class="bg-white dark:bg-gray-800 shadow" v-if="$slots.header">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <slot name="header" />
            </div>
        </header>

        <!-- Page Content -->
        <main class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div
                    class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg"
                >
                    <div class="p-6 text-gray-900 dark:text-gray-100">
                        <slot />
                        <!-- Where the page content will go -->
                    </div>
                </div>
            </div>
        </main>

        <!-- Footer (Optional) -->
        <footer
            class="text-center py-4 text-sm text-gray-500 dark:text-gray-400"
        >
            © {{ new Date().getFullYear() }} {{ appName }}. All rights reserved.
        </footer>
    </div>

    <!-- Login Modal -->
    <LoginModal />
    <RegistrationModal />
    <Toaster />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
