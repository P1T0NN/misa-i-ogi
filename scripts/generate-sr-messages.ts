/**
 * Generates messages/sr.json from en.json using phrase-level Serbian (Latin) translations.
 * Existing sr.json translations always win — this script only fills keys that are
 * new in en.json, so it never clobbers hand-curated translations.
 * Run: bun scripts/generate-sr-messages.ts
 */
import en from '../messages/en.json';
import existingSr from '../messages/sr.json';
import { writeFileSync } from 'node:fs';

/** Exact English → Serbian (Latin) phrase map. Unmapped strings stay in English. */
const PHRASES: Record<string, string> = {
	Login: 'Prijava',
	Logout: 'Odjava',
	'Logged out successfully.': 'Uspešno ste se odjavili.',
	'Continue with Google': 'Nastavi sa Google nalogom',
	'Created by': 'Kreirao',
	'Send a message': 'Pošalji poruku',
	'Your name': 'Vaše ime',
	'Your full name': 'Vaše puno ime',
	Email: 'Email',
	Message: 'Poruka',
	Contact: 'Kontakt',
	'Enter your email below to login to your account': 'Unesite email ispod da biste se prijavili',
	'Login to your account': 'Prijavite se na nalog',
	'Forgot your password?': 'Zaboravili ste lozinku?',
	"Don't have an account?": 'Nemate nalog?',
	'Sign up': 'Registracija',
	'Sign in failed. Please check your credentials and try again.':
		'Prijava nije uspela. Proverite podatke i pokušajte ponovo.',
	'Signed in successfully.': 'Uspešno ste se prijavili.',
	'Or continue with': 'Ili nastavite sa',
	'Check your email': 'Proverite email',
	'Verification code': 'Verifikacioni kod',
	Resend: 'Pošalji ponovo',
	Continue: 'Nastavi',
	Cancel: 'Otkaži',
	'Reset your password': 'Resetujte lozinku',
	'Choose a new password': 'Izaberite novu lozinku',
	'Send code': 'Pošalji kod',
	Code: 'Kod',
	'New password': 'Nova lozinka',
	'Confirm new password': 'Potvrdite novu lozinku',
	'Password reset successfully.': 'Lozinka je uspešno resetovana.',
	'Show password': 'Prikaži lozinku',
	'Hide password': 'Sakrij lozinku',
	Apartment: 'Apartman',
	Hotel: 'Hotel',
	Villa: 'Vila',
	Hostel: 'Hostel',
	Other: 'Ostalo',
	Restaurant: 'Restoran',
	Café: 'Kafić',
	Bar: 'Bar',
	'Night club': 'Noćni klub',
	'Horse ride': 'Vožnja konjem',
	Spa: 'Spa',
	Tour: 'Tura',
	'Your stay': 'Vaš boravak',
	'Back to home': 'Nazad na početnu',
	Accommodations: 'Smeštaji',
	Users: 'Korisnici',
	Active: 'Aktivan',
	Inactive: 'Neaktivan',
	Name: 'Naziv',
	Type: 'Tip',
	Address: 'Adresa',
	Created: 'Kreirano',
	Status: 'Status',
	Search: 'Pretraga',
	'Search...': 'Pretraga...',
	'Search results': 'Rezultati pretrage',
	Searching: 'Pretraga…',
	'No results found': 'Nema rezultata',
	'Try a different search term.': 'Pokušajte sa drugim pojmom.',
	English: 'Engleski',
	Serbian: 'Srpski',
	'Choose language': 'Izaberite jezik',
	Submit: 'Pošalji',
	Close: 'Zatvori',
	Delete: 'Obriši',
	Save: 'Sačuvaj',
	Edit: 'Izmeni',
	Add: 'Dodaj',
	Back: 'Nazad',
	Home: 'Početna',
	Description: 'Opis',
	Title: 'Naslov',
	Role: 'Uloga',
	Verified: 'Verifikovan',
	Banned: 'Banovan',
	'Too many requests. Please try again later.': 'Previše zahteva. Pokušajte ponovo kasnije.',
	'Please sign in to continue.': 'Prijavite se da biste nastavili.',
	"You're not allowed to perform this action.": 'Nemate dozvolu za ovu radnju.',
	'This action requires admin privileges.': 'Ova radnja zahteva administratorske privilegije.',
	'User not found.': 'Korisnik nije pronađen.',
	'User deleted.': 'Korisnik je obrisan.',
	'Accommodation created.': 'Smeštaj je kreiran.',
	'Guest stay unlocked.': 'Boravak gosta je otključan.',
	'This stay is already unlocked.': 'Ovaj boravak je već otključan.',
	'Could not save the uploaded file. Please try again.':
		'Nije moguće sačuvati fajl. Pokušajte ponovo.',
	'You need to correct form errors': 'Ispravite greške u formi',
	Proceed: 'Nastavi',
	Download: 'Preuzmi',
	Partnerships: 'Partnerstva',
	Hospitalities: 'Ugostiteljski objekti',
	'Add accommodation': 'Dodaj smeštaj',
	'Add hospitality': 'Dodaj objekat',
	'Add partnership': 'Dodaj partnerstvo'
};

function translateValue(value: string): string {
	return PHRASES[value] ?? value;
}

function translateTree<T>(node: T, existing: unknown): T {
	if (typeof node === 'string') {
		if (typeof existing === 'string' && existing.length > 0) {
			return existing as T;
		}
		return translateValue(node) as T;
	}
	if (node && typeof node === 'object') {
		if (Array.isArray(node)) {
			return node.map((item, i) =>
				translateTree(item, Array.isArray(existing) ? existing[i] : undefined)
			) as T;
		}
		const prev =
			existing && typeof existing === 'object' && !Array.isArray(existing)
				? (existing as Record<string, unknown>)
				: undefined;
		const out: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
			out[key] = translateTree(value, prev?.[key]);
		}
		return out as T;
	}
	return node;
}

const sr = translateTree(en, existingSr);

writeFileSync('messages/sr.json', `${JSON.stringify(sr, null, '\t')}\n`, 'utf8');
console.log('Wrote messages/sr.json');
