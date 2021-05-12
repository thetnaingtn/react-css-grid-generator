import React,{useEffect} from 'react';

import "../../assets/styles/app-modal.scss"

const AppModal = function({children, modalHandler, modalStatus}){

	useEffect(() => {
		function closeOnEsc(event){
			if(event.keyCode === 27){
				modalHandler(false);
			}
		}
		document.addEventListener('keydown', closeOnEsc);
		return () => document.removeEventListener('keydown', closeOnEsc);
	}, []);

	if(!modalStatus) return null;
	return (
		<div className="modal-mask">
			<div className="modal-wrapper">
				<div className="modal-container" role="dialog">
					{children}
					<button
						type="button"
						className="modal-button"
						onClick={() => modalHandler(false)}
					>Done</button>
				</div>
			</div>
		</div>
	)
}

AppModal.Header = function({children}){
	return(
		<header className="modal-header" id="modalTitle">
			{children}
		</header>
	)
};

AppModal.Section = function({children}){
	return(
		<section className="modal-body" id="modalDescription">
			{children}
		</section>
	)
};


export default AppModal;
