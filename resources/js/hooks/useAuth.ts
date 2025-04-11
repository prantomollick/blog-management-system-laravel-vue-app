import { ref, computed } from "vue";
import { usePage } from "@inertiajs/vue3";

export const useAuth = () => {
    const page = usePage();
    const user = ref(page.props.auth?.user); // Use ref() for reactivity

    // Authentication check
    const isAuthenticated = computed(() => !!user.value);

    return { user, isAuthenticated };
};
