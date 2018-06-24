const toggleNav = ( nav, navClass ) => {
	nav.classList.toggle( `${navClass}--active` );
	document.body.classList.toggle( 'fixed-scroll' );
};

const initNavToggler = ( burgerId, navId ) => {
	const burger = document.getElementById( burgerId );
	const nav = document.getElementById( navId );
	const navClass = nav.className;

	burger.addEventListener( 'click', toggleNav.bind( null, nav, navClass ) );
};

initNavToggler( 'burger', 'navigation' );