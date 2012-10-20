(custom-set-variables
  ;; custom-set-variables was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 '(flymake-allowed-file-name-masks (quote (("\\.\\(?:c\\(?:pp\\|xx\\|\\+\\+\\)?\\|CC\\)\\'" flymake-simple-make-init) ("\\.xml\\'" flymake-xml-init) ("\\.html?\\'" flymake-xml-init) ("\\.cs\\'" flymake-simple-make-init) ("\\.p[ml]\\'" flymake-perl-init) ("\\.php[345]?\\'" flymake-php-init) ("\\.js\\'" flymake-javascript-init) ("\\.css\\'" flymake-css-init) ("\\.h\\'" flymake-master-make-header-init flymake-master-cleanup) ("\\.java\\'" jde-ecj-server-flymake-init jde-ecj-flymake-cleanup) ("[0-9]+\\.tex\\'" flymake-master-tex-init flymake-master-cleanup) ("\\.tex\\'" flymake-simple-tex-init) ("\\.idl\\'" flymake-simple-make-init) ("\\.spec\\'" flymake-specfile-init) ("\\.po\\'" flymake-pofile-init))))
 '(jde-compiler (quote (("eclipse java compiler server" "/usr/share/java/ecj.jar"))))
 '(mumamo-background-colors nil)
 '(safe-local-variable-values (quote ((js-indent-level . 2)))))
(custom-set-faces
  ;; custom-set-faces was added by Custom.
  ;; If you edit it by hand, you could mess it up, so be careful.
  ;; Your init file should contain only one such instance.
  ;; If there is more than one, they won't work right.
 '(ido-only-match ((((class color)) (:foreground "yellow"))))
 '(ido-subdir ((((min-colors 88) (class color)) (:foreground "steelblue"))))
 '(mumamo-background-chunk-submode1 ((((class color) (min-colors 88) (background dark)) nil)))
 '(preview-face ((((background dark)) (:background "dark slate gray"))))
 '(preview-reference-face ((t (:foreground "yellow2" :height 1.8)))))
