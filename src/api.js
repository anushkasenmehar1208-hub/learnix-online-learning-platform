const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(options.body ? {"Content-Type": "application/json"} : {}),
            ...options.headers,
        },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        const detail = data?.detail;
        const message = Array.isArray(detail)
            ? detail.map(error => error.msg).join(", ")
            : detail || "Request failed";
        throw new Error(message);
    }

    return data;
}

function formatCourse(course) {
    return {
        ...course,
        whatYouWillLearn: course.what_you_will_learn || course.whatYouWillLearn || [],
    };
}

export async function getCourses() {
    const courses = await apiRequest("/courses");
    return courses.map(formatCourse);
}

export async function requestOtp(email) {
    return apiRequest("/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({email}),
    });
}

export async function verifyOtp(email, otp) {
    return apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({email, otp}),
    });
}

export async function enrollInCourse(courseId, userId) {
    return apiRequest(`/courses/${courseId}/enroll`, {
        method: "POST",
        body: JSON.stringify({user_id: userId}),
    });
}

export async function getUserCourses(userId) {
    const courses = await apiRequest(`/users/${userId}/courses`);
    return courses.map(formatCourse);
}

export async function getUserProgress(userId) {
    return apiRequest(`/users/${userId}/progress`);
}

export async function getCourseProgress(userId, courseId) {
    return apiRequest(`/users/${userId}/courses/${courseId}/progress`);
}

export async function updateCourseProgress(userId, courseId, completedLessons) {
    return apiRequest(`/users/${userId}/courses/${courseId}/progress`, {
        method: "PUT",
        body: JSON.stringify({completed_lessons: completedLessons}),
    });
}
