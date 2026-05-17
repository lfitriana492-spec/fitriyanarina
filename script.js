// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate NIK format
        const nikInput = document.getElementById('nik');
        if (nikInput.value.length !== 16) {
            alert('NIK harus terdiri dari 16 digit');
            nikInput.focus();
            return;
        }

        // Validate phone number format
        const phoneInput = document.getElementById('parentPhone');
        if (!/^\d{10,}$/.test(phoneInput.value.replace(/\D/g, ''))) {
            alert('Nomor telepon tidak valid. Harus minimal 10 digit');
            phoneInput.focus();
            return;
        }

        // Validate average score
        const scoreInput = document.getElementById('averageScore');
        if (scoreInput.value < 0 || scoreInput.value > 100) {
            alert('Rata-rata nilai harus antara 0-100');
            scoreInput.focus();
            return;
        }

        // Validate terms agreement
        if (!document.getElementById('agreeTerms').checked) {
            alert('Anda harus menyetujui syarat dan ketentuan');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Hide form and show loading
        form.style.display = 'none';
        document.getElementById('loadingMessage').style.display = 'block';

        // Simulate processing delay
        setTimeout(function() {
            // Save data to localStorage
            saveRegistration(data);

            // Hide loading and show data preview
            document.getElementById('loadingMessage').style.display = 'none';
            displayDataPreview(data);
            document.getElementById('dataPreview').style.display = 'block';

            // Show success message after 3 seconds
            setTimeout(function() {
                document.getElementById('dataPreview').style.display = 'none';
                successMessage.style.display = 'block';
            }, 3000);
        }, 2000);

        // Log the data (for development purposes)
        console.log('Data Pendaftaran:', data);
    });

    // Real-time NIK validation
    document.getElementById('nik').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 16);
    });

    // Real-time phone number input (allow only digits)
    document.getElementById('parentPhone').addEventListener('input', function() {
        const phoneValue = this.value.replace(/\D/g, '');
        if (phoneValue.length > 0) {
            // Format phone number as it's typed
            if (phoneValue.length <= 4) {
                this.value = phoneValue;
            } else if (phoneValue.length <= 8) {
                this.value = phoneValue.slice(0, 4) + '-' + phoneValue.slice(4);
            } else {
                this.value = phoneValue.slice(0, 4) + '-' + phoneValue.slice(4, 8) + '-' + phoneValue.slice(8, 12);
            }
        }
    });

    // Date validation - don't allow future dates
    document.getElementById('birthDate').addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        
        if (selectedDate > today) {
            alert('Tanggal lahir tidak boleh lebih besar dari hari ini');
            this.value = '';
        }

        // Calculate age
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            age--;
        }

        if (age < 12) {
            alert('Peserta didik harus minimal berusia 12 tahun');
            this.value = '';
        }
    });

    // Average score validation
    document.getElementById('averageScore').addEventListener('blur', function() {
        if (this.value && (this.value < 0 || this.value > 100)) {
            alert('Rata-rata nilai harus antara 0-100');
            this.value = '';
        }
    });

    // Year validation
    document.getElementById('previousSchoolYear').addEventListener('change', function() {
        const year = parseInt(this.value);
        const currentYear = new Date().getFullYear();

        if (year > currentYear) {
            alert('Tahun lulus tidak boleh melebihi tahun sekarang');
            this.value = '';
        } else if (year < currentYear - 5) {
            const confirm = window.confirm('Tahun lulus sudah cukup lama, apakah ini benar?');
            if (!confirm) {
                this.value = '';
            }
        }
    });

    // Postal code validation
    document.getElementById('postalCode').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 5);
    });
});

// Function to display data preview
function displayDataPreview(data) {
    document.getElementById('previewFullName').textContent = data.fullName || '-';
    document.getElementById('previewBirthDate').textContent = formatDate(data.birthDate) || '-';
    document.getElementById('previewPlaceOfBirth').textContent = data.placeOfBirth || '-';
    document.getElementById('previewGender').textContent = data.gender || '-';
    document.getElementById('previewNIK').textContent = data.nik || '-';
    document.getElementById('previewReligion').textContent = data.religion || '-';
    document.getElementById('previewFatherName').textContent = data.fatherName || '-';
    document.getElementById('previewMotherName').textContent = data.motherName || '-';
    document.getElementById('previewParentPhone').textContent = data.parentPhone || '-';
    document.getElementById('previewAddress').textContent = data.address || '-';
    document.getElementById('previewCity').textContent = data.city || '-';
    document.getElementById('previewPostalCode').textContent = data.postalCode || '-';
    document.getElementById('previewPreviousSchool').textContent = data.previousSchool || '-';
    document.getElementById('previewPreviousSchoolYear').textContent = data.previousSchoolYear || '-';
    document.getElementById('previewAverageScore').textContent = data.averageScore || '-';
}

// Function to format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Function to save registration data
function saveRegistration(data) {
    let registrations = JSON.parse(localStorage.getItem('registrations')) || [];

    // Add timestamp and ID
    const registration = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('id-ID'),
        ...data
    };

    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));

    // Log to console
    console.log('Total Pendaftar:', registrations.length);
    console.log('Data tersimpan:', registration);
}

// Function to get all registrations from localStorage
function getAllRegistrations() {
    return JSON.parse(localStorage.getItem('registrations')) || [];
}

// Function to delete a registration
function deleteRegistration(id) {
    let registrations = getAllRegistrations();
    registrations = registrations.filter(reg => reg.id !== id);
    localStorage.setItem('registrations', JSON.stringify(registrations));
}

// Function to export data as CSV
function exportToCSV() {
    const registrations = getAllRegistrations();

    if (registrations.length === 0) {
        alert('Tidak ada data pendaftaran untuk diexport');
        return;
    }

    // Get column headers
    const headers = Object.keys(registrations[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    registrations.forEach(reg => {
        const values = headers.map(header => {
            const value = reg[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        });
        csvContent += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `pendaftaran_mts_raudlatul_huda_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to view all registrations (for admin purposes)
function viewAllRegistrations() {
    const registrations = getAllRegistrations();
    console.table(registrations);
    return registrations;
}

// Display count of registrations on page load
document.addEventListener('DOMContentLoaded', function() {
    const count = getAllRegistrations().length;
    if (count > 0) {
        console.log(`Total pendaftar yang tersimpan: ${count} orang`);
    }
});
